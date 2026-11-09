import { session } from '../data/session.js'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function errorMessage(body, status) {
  if (typeof body === 'string' && body.trim() && !body.trim().startsWith('<')) return body
  if (body?.errors) return Object.values(body.errors).flat().join(' ')
  return (
    body?.detail ||
    body?.title ||
    {
      401: 'Your session has expired. Please sign in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested record was not found.',
    }[status] ||
    'The request failed. Please try again.'
  )
}

export function createHttpClient({
  baseUrl = '',
  fetcher = globalThis.fetch,
  getToken = () => session.get()?.token,
  onUnauthorized = () => session.set(null),
} = {}) {
  return async function request(path, { body, method = 'GET', signal } = {}) {
    const headers = { Accept: 'application/json' }
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
    const multipart = body instanceof FormData
    if (body !== undefined && !multipart) headers['Content-Type'] = 'application/json'
    let response
    try {
      response = await fetcher(`${baseUrl.replace(/\/$/, '')}${path}`, {
        method,
        headers,
        signal,
        body: body === undefined ? undefined : multipart ? body : JSON.stringify(body),
      })
    } catch (error) {
      if (error.name === 'AbortError') throw error
      throw new ApiError('Cannot reach the server. Check that the API is running.')
    }
    const raw = response.status === 204 ? '' : await response.text()
    let data = raw || null
    try {
      data = raw ? JSON.parse(raw) : null
    } catch {
      /* Some legacy endpoints return plain text. */
    }
    if (!response.ok) {
      if (response.status === 401) onUnauthorized()
      throw new ApiError(errorMessage(data, response.status), response.status)
    }
    return data
  }
}

export const http = createHttpClient({ baseUrl: import.meta.env?.VITE_API_BASE_URL || '' })
