import { accountRepository as repo } from '../data/accountRepository.js'
import { authDto, profileDto, profileInput } from '../dto/accountDto.js'
import { session } from '../data/session.js'

export const accountService = {
  async login(form) {
    const result = authDto(await repo.login({ email: form.email.trim(), password: form.password }))
    session.set(result)
    return result
  },
  async register(form) {
    if (!form.name.trim()) throw new Error('Enter your name.')
    if (form.password.length < 8) throw new Error('Use a password with at least 8 characters.')
    await repo.register({
      userName: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      roleID: Number(form.roleId) === 2 ? 2 : 3,
    })
    return this.login(form)
  },
  async profile(id) {
    try {
      return { form: profileDto(await repo.profile(id)), exists: true }
    } catch (error) {
      if (error.status === 404) return { form: profileDto(), exists: false }
      throw error
    }
  },
  saveProfile: (id, form, exists) =>
    exists ? repo.updateProfile(id, profileInput(form)) : repo.createProfile(profileInput(form)),
  async users() {
    try {
      return (await repo.users()) || []
    } catch (error) {
      if (error.status === 404) return []
      throw error
    }
  },
  removeUser: repo.removeUser,
  logout: () => session.set(null),
}
