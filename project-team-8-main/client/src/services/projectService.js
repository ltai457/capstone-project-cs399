import { projectRepository as repo } from '../data/projectRepository.js'
import { projectDto, projectFormData, projectInput, safeUrl } from '../dto/projectDto.js'
import { commentDto } from '../dto/accountDto.js'

const list = (raw) => (Array.isArray(raw) ? raw : raw ? [raw] : []).map(projectDto)

export function validateProject(form, editing = false) {
  for (const key of ['name', 'overview', 'teamName', 'semester']) {
    if (!form[key]?.trim()) throw new Error('Please complete all required project fields.')
  }
  if (!Number.isInteger(Number(form.teamNumber)) || Number(form.teamNumber) < 1) {
    throw new Error('Team number must be a positive whole number.')
  }
  if (!editing && !safeUrl(form.videoUrl))
    throw new Error('Enter a valid HTTP or HTTPS demo video URL.')
  if (form.githubUrl && !safeUrl(form.githubUrl)) throw new Error('Enter a valid repository URL.')
  if (form.image && (form.image.type !== 'image/png' || form.image.size > 5 * 1024 * 1024)) {
    throw new Error('Choose a PNG poster smaller than 5 MB.')
  }
}

export const projectService = {
  list: async () => list(await repo.list()),
  get: async (id) => projectDto(await repo.get(id)),
  mine: async () => {
    try {
      return list(await repo.mine())
    } catch (error) {
      if (error.status === 404) return []
      throw error
    }
  },
  pending: async () => list(await repo.pending()),
  save: (form, id) => {
    validateProject(form, Boolean(id))
    return id ? repo.update(id, projectInput(form)) : repo.create(projectFormData(form))
  },
  remove: repo.remove,
  approve: repo.approve,
  decline: repo.decline,
  award: repo.award,
  like: repo.like,
  likes: repo.likes,
  comments: async (id) => ((await repo.comments(id)) || []).map(commentDto),
  comment: (id, text) => {
    if (!text.trim()) throw new Error('Write a comment first.')
    if (text.length > 2000) throw new Error('Keep comments under 2,000 characters.')
    return repo.comment(id, text.trim())
  },
  removeComment: repo.removeComment,
}
