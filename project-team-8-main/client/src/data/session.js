const key = 'democraft.session.v2'
let current = read()
const listeners = new Set()

function read() {
  try {
    return JSON.parse(globalThis.sessionStorage?.getItem(key) || 'null')
  } catch {
    return null
  }
}

export const session = {
  get: () => current,
  set(value) {
    current = value
    try {
      if (value) globalThis.sessionStorage?.setItem(key, JSON.stringify(value))
      else globalThis.sessionStorage?.removeItem(key)
    } catch {
      /* In-memory sessions still work if browser storage is disabled. */
    }
    listeners.forEach((listener) => listener(value))
  },
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
