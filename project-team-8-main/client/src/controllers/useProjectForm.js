import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { emptyProject } from '../dto/projectDto.js'
import { projectService } from '../services/projectService.js'
import { useAction } from '../handlers/useAction.js'
import { useSession } from './useSession.js'

export function useProjectForm() {
  const route = useRoute()
  const router = useRouter()
  const { user, isAdmin } = useSession()
  const editing = computed(() => Boolean(route.params.id))
  const form = reactive(emptyProject())
  const ready = ref(!editing.value)
  const action = useAction()
  onMounted(() => {
    if (editing.value)
      action.run(async () => {
        const project = await projectService.get(route.params.id)
        if (!isAdmin.value && project.ownerId !== user.value.id) return router.replace('/profile')
        Object.assign(form, project)
        ready.value = true
      })
  })
  const submit = () =>
    action.run(async () => {
      if (!ready.value) throw new Error('Load the project before saving changes.')
      await projectService.save(form, route.params.id)
      await router.push({ name: 'profile', query: { saved: '1' } })
    })
  return { ...action, form, editing, ready, submit }
}
