import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { projectService } from '../services/projectService.js'
import { useAction } from '../handlers/useAction.js'

export function useProjectDetail() {
  const route = useRoute()
  const action = useAction()
  const project = ref(null)
  const comments = ref([])
  const likes = ref(0)
  const text = ref('')
  const id = route.params.id
  onMounted(() =>
    action.run(async () => {
      project.value = await projectService.get(id)
      const [discussion, count] = await Promise.all([
        projectService.comments(id),
        projectService.likes(id),
      ])
      comments.value = discussion
      likes.value = Number(count) || 0
    }),
  )
  const like = () =>
    action.run(async () => {
      await projectService.like(id)
      likes.value = Number(await projectService.likes(id)) || 0
    }, 'Thanks for supporting this project.')
  const comment = () =>
    action.run(async () => {
      await projectService.comment(id, text.value)
      text.value = ''
      comments.value = await projectService.comments(id)
    }, 'Comment posted.')
  const removeComment = (commentId) =>
    action.run(async () => {
      await projectService.removeComment(commentId)
      comments.value = await projectService.comments(id)
    })
  return { ...action, route, project, comments, likes, text, like, comment, removeComment }
}
