import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { accountService } from '../services/accountService.js'
import { useAction } from '../handlers/useAction.js'

export function useAuth() {
  const route = useRoute()
  const router = useRouter()
  const registering = computed(() => route.name === 'register')
  const form = reactive({ name: '', email: '', password: '', roleId: 2 })
  const action = useAction()
  const submit = () =>
    action.run(async () => {
      const user = registering.value
        ? await accountService.register(form)
        : await accountService.login(form)
      const redirect = route.query.redirect
      await router.push(
        typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : user.role === 'Admin'
            ? '/admin'
            : '/profile',
      )
    })
  return { ...action, route, registering, form, submit }
}
