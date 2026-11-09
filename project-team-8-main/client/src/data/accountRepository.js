import { http } from '../handlers/http.js'

export const accountRepository = {
  login: (body) => http('/api/Authentication/Login', { method: 'POST', body }),
  register: (body) => http('/api/Authentication/Register', { method: 'POST', body }),
  profile: (id) => http(`/api/Profile/ByUserId/${id}`),
  createProfile: (body) => http('/api/Profile', { method: 'POST', body }),
  updateProfile: (userId, body) => http(`/api/Profile/${userId}`, { method: 'PUT', body }),
  users: () => http('/api/User/AllUser'),
  removeUser: (id) => http(`/api/Authentication/DeleteUser/${id}`, { method: 'DELETE' }),
}
