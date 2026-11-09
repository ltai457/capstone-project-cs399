import { computed, onMounted, ref } from 'vue'
import { projectService } from '../services/projectService.js'
import { accountService } from '../services/accountService.js'
import { useAction } from '../handlers/useAction.js'

export function useAdmin() {
  const action = useAction()
  const tab = ref('pending')
  const search = ref('')
  const pending = ref([])
  const published = ref([])
  const users = ref([])
  const confirmation = ref(null)
  const rows = computed(() => (tab.value === 'pending' ? pending.value : published.value))
  async function reload() {
    const [review, projects, members] = await Promise.all([
      projectService.pending(),
      projectService.list(),
      accountService.users(),
    ])
    pending.value = review
    published.value = projects
    users.value = members
  }
  onMounted(() => action.run(reload))
  const act = (task, message) =>
    action.run(async () => {
      await task()
      await reload()
    }, message)
  const approve = (project) => act(() => projectService.approve(project.id), 'Project published.')
  const award = (project) =>
    act(() => projectService.award(project.id, !project.winner), 'Award updated.')
  function askRemoveProject(project) {
    const isPending = tab.value === 'pending'
    confirmation.value = {
      title: isPending ? 'Decline this submission?' : 'Delete this project?',
      description: `This permanently removes ${project.name} and its discussion.`,
      action: () =>
        isPending ? projectService.decline(project.id) : projectService.remove(project.id),
    }
  }
  function askRemoveUser(member) {
    confirmation.value = {
      title: 'Delete this account?',
      description: `This permanently deletes the account for ${member.userName}.`,
      action: () => accountService.removeUser(member.userID),
    }
  }
  function confirm() {
    const task = confirmation.value.action
    confirmation.value = null
    act(task, 'Change saved.')
  }
  return {
    ...action,
    tab,
    search,
    pending,
    published,
    users,
    confirmation,
    rows,
    approve,
    award,
    askRemoveProject,
    askRemoveUser,
    confirm,
  }
}
