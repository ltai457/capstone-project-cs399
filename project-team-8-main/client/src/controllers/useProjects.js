import { computed, ref } from 'vue'
import { projectService } from '../services/projectService.js'
import { useAction } from '../handlers/useAction.js'

export function useProjects(source = 'list') {
  const action = useAction()
  const projects = ref([])
  const search = ref('')
  const semester = ref(null)
  const winnersOnly = ref(false)
  const semesters = computed(() =>
    [...new Set(projects.value.map((p) => p.semester).filter(Boolean))].sort().reverse(),
  )
  const filtered = computed(() =>
    projects.value.filter((project) => {
      const text =
        `${project.name} ${project.teamName} ${project.languages} ${project.overview}`.toLowerCase()
      return (
        (!search.value || text.includes(search.value.toLowerCase())) &&
        (!semester.value || project.semester === semester.value) &&
        (!winnersOnly.value || project.winner)
      )
    }),
  )
  const load = () =>
    action.run(async () => {
      projects.value = await projectService[source]()
    })
  function clearFilters() {
    search.value = ''
    semester.value = null
    winnersOnly.value = false
  }
  return {
    ...action,
    projects,
    search,
    semester,
    semesters,
    winnersOnly,
    filtered,
    load,
    clearFilters,
  }
}
