import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSession } from './useSession.js'
import { useProjects } from './useProjects.js'
import { accountService } from '../services/accountService.js'
import { profileDto } from '../dto/accountDto.js'

export function useProfile() {
  const { user, canSubmit, isAdmin } = useSession()
  const route = useRoute()
  const collection = useProjects('mine')
  const form = reactive(profileDto())
  const exists = ref(false)
  const ready = ref(false)
  onMounted(async () => {
    await collection.run(async () => {
      const result = await accountService.profile(user.value.id)
      Object.assign(form, result.form)
      exists.value = result.exists
      ready.value = true
    })
    if (ready.value) await collection.load()
    if (route.query.saved)
      collection.success.value =
        'Project saved. Student submissions need admin approval before publication.'
  })
  const save = () =>
    collection.run(async () => {
      await accountService.saveProfile(user.value.id, form, exists.value)
      exists.value = true
    }, 'Profile saved.')
  return { ...collection, user, canSubmit, isAdmin, form, ready, save }
}
