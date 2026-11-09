import { ref } from 'vue'

export function useAction() {
  const busy = ref(false)
  const error = ref('')
  const success = ref('')
  async function run(action, message = '') {
    if (busy.value) return
    busy.value = true
    error.value = ''
    success.value = ''
    try {
      const result = await action()
      success.value = message
      return result
    } catch (cause) {
      error.value = cause.message || 'Something went wrong. Please try again.'
    } finally {
      busy.value = false
    }
  }
  return { busy, error, success, run }
}
