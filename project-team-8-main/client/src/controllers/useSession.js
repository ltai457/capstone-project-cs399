import { computed, onScopeDispose, shallowRef } from 'vue'
import { session } from '../data/session.js'
import { accountService } from '../services/accountService.js'

export function useSession() {
  const user = shallowRef(session.get())
  onScopeDispose(
    session.subscribe((value) => {
      user.value = value
    }),
  )
  return {
    user,
    signedIn: computed(() => Boolean(user.value)),
    isAdmin: computed(() => user.value?.role === 'Admin'),
    canSubmit: computed(() => ['Admin', 'Student'].includes(user.value?.role)),
    logout: accountService.logout,
  }
}
