import test from 'node:test'
import assert from 'node:assert/strict'
import { projectDto, projectFormData, safeUrl, emptyProject } from '../src/dto/projectDto.js'
import { authDto, profileDto, profileInput } from '../src/dto/accountDto.js'
import { validateProject } from '../src/services/projectService.js'
import { createHttpClient, ApiError } from '../src/handlers/http.js'

test('legacy API fields become a stable project view model and unsafe links are removed', () => {
  const project = projectDto({
    projectID: 8,
    projectName: 'Demo',
    projectOverView: 'Overview',
    teamMember: 'A, B',
    ownerID: 14,
    isApproved: true,
    linktoGit: 'javascript:alert(1)',
  })
  assert.equal(project.id, 8)
  assert.equal(project.overview, 'Overview')
  assert.equal(project.members, 'A, B')
  assert.equal(project.ownerId, 14)
  assert.equal(project.approved, true)
  assert.equal(project.githubUrl, '')
  assert.equal(safeUrl('https://github.com/example/project'), 'https://github.com/example/project')
  assert.equal(safeUrl('data:text/html,abc'), '')
})

test('multipart submission uses the existing ASP.NET form field names', () => {
  const image = new File(['image'], 'poster.png', { type: 'image/png' })
  const data = projectFormData({
    ...emptyProject(),
    name: ' Project ',
    overview: ' Story ',
    teamName: ' Team ',
    teamNumber: '8',
    members: ' A, B ',
    semester: '2026 S2',
    image,
  })
  assert.equal(data.get('projectName'), 'Project')
  assert.equal(data.get('projectOverView'), 'Story')
  assert.equal(data.get('teamMember'), 'A, B')
  assert.equal(data.get('teamNumber'), '8')
  assert.equal(data.get('img').name, 'poster.png')
  assert.equal(data.has('ownerID'), false)
  assert.equal(data.has('isApproved'), false)
})

test('project validation rejects missing data, invalid team numbers and unsupported uploads', () => {
  const valid = {
    ...emptyProject(),
    name: 'Demo',
    overview: 'Story',
    teamName: 'Team',
    teamNumber: 8,
    semester: '2026 S2',
    videoUrl: 'https://youtube.com/watch?v=example',
  }
  assert.doesNotThrow(() => validateProject(valid))
  assert.throws(() => validateProject({ ...valid, name: '  ' }))
  assert.throws(() => validateProject({ ...valid, teamNumber: 1.5 }))
  assert.throws(() => validateProject({ ...valid, videoUrl: 'javascript:alert(1)' }))
  assert.throws(() =>
    validateProject({ ...valid, image: new File(['x'], 'poster.svg', { type: 'image/svg+xml' }) }),
  )
  assert.doesNotThrow(() => validateProject({ ...valid, videoUrl: '' }, true))
})

test('profile mapping preserves the API underscore names when writing', () => {
  const form = profileDto({
    mainCoding_Language: 'JavaScript',
    contact_Detail: 'hello@example.test',
    semester: '2026 S2',
  })
  assert.equal(form.languages, 'JavaScript')
  assert.equal(profileInput(form).contact_Detail, 'hello@example.test')
})

test('only an authenticated API response creates a session DTO', () => {
  assert.throws(() => authDto({ token: 'token', isAuthenticated: false }))
  assert.equal(authDto({ token: 'token', isAuthenticated: true, role: 'Student', userID: 8 }).id, 8)
})

test('HTTP handler supports JSON, plain text and empty legacy responses', async () => {
  const responses = [
    new Response('{"projectID":8}'),
    new Response('Project Updated'),
    new Response(null, { status: 204 }),
  ]
  const calls = []
  const request = createHttpClient({
    baseUrl: 'https://api.example.test/',
    getToken: () => 'token',
    fetcher: async (url, options) => {
      calls.push({ url, options })
      return responses.shift()
    },
  })
  assert.deepEqual(await request('/api/projects'), { projectID: 8 })
  assert.equal(
    await request('/api/projects/8', { method: 'PUT', body: { name: 'Demo' } }),
    'Project Updated',
  )
  assert.equal(await request('/api/projects/8', { method: 'DELETE' }), null)
  assert.equal(calls[0].url, 'https://api.example.test/api/projects')
  assert.equal(calls[0].options.headers.Authorization, 'Bearer token')
  assert.equal(calls[1].options.body, '{"name":"Demo"}')
})

test('multipart boundary is left to fetch, while auth headers remain attached', async () => {
  const data = new FormData()
  const request = createHttpClient({
    getToken: () => 'token',
    fetcher: async (_, options) => {
      assert.equal(options.body, data)
      assert.equal(options.headers['Content-Type'], undefined)
      assert.equal(options.headers.Authorization, 'Bearer token')
      return new Response(null, { status: 204 })
    },
  })
  await request('/api/projects', { method: 'POST', body: data })
})

test('401 clears the session and validation errors remain readable', async () => {
  let cleared = false
  const request = createHttpClient({
    getToken: () => null,
    onUnauthorized: () => {
      cleared = true
    },
    fetcher: async () => new Response(null, { status: 401 }),
  })
  await assert.rejects(
    request('/api/profile'),
    (error) => error instanceof ApiError && error.status === 401,
  )
  assert.equal(cleared, true)
  const invalid = createHttpClient({
    fetcher: async () =>
      new Response(JSON.stringify({ errors: { Email: ['Invalid email.'] } }), { status: 400 }),
  })
  await assert.rejects(invalid('/api/register'), /Invalid email/)
})

test('network failures become actionable errors and cancellation remains cancellation', async () => {
  const request = createHttpClient({
    fetcher: async () => {
      throw new TypeError('Failed to fetch')
    },
  })
  await assert.rejects(request('/api/projects'), /Check that the API is running/)
  const abort = createHttpClient({
    fetcher: async () => {
      throw new DOMException('Aborted', 'AbortError')
    },
  })
  await assert.rejects(abort('/api/projects'), { name: 'AbortError' })
})
