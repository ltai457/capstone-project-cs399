import { http } from '../handlers/http.js'

export const projectRepository = {
  list: () => http('/api/Projects/GetAllProject'),
  get: (id) => http(`/api/Projects/Project${id}`),
  mine: () => http('/api/Projects/user'),
  pending: () => http('/api/Projects/PendingApprovalProjects'),
  create: (body) => http('/api/Projects/AddNewProjectWithImage', { method: 'POST', body }),
  update: (id, body) => http(`/api/Projects/UpdateProjectBy/${id}`, { method: 'PUT', body }),
  remove: (id) => http(`/api/Projects/DeleteProjectBy${id}`, { method: 'DELETE' }),
  approve: (id) => http(`/api/Projects/${id}/approve`, { method: 'PUT' }),
  decline: (id) => http(`/api/Projects/${id}/decline`, { method: 'PUT' }),
  award: (id, winner) =>
    http('/api/Like/AwardProject', { method: 'POST', body: { projectID: id, isWinner: winner } }),
  like: (id) => http(`/api/Like/LikeProject/${id}`, { method: 'POST' }),
  likes: (id) => http(`/api/Projects/likescount/${id}`),
  comments: (id) => http(`/api/Comment/GetProjectComments?id=${id}`),
  comment: (id, text) =>
    http('/api/Comment/WriteComment', {
      method: 'POST',
      body: { projectID: id, commentText: text },
    }),
  removeComment: (id) => http(`/api/Comment/DeleteComment?id=${id}`, { method: 'DELETE' }),
}
