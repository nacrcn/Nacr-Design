/**
 * useToggle — 布尔值切换
 */
export function useToggle(initial = false) {
  const state = ref(initial)

  const toggle = () => {
    state.value = !state.value
  }

  const setTrue = () => {
    state.value = true
  }

  const setFalse = () => {
    state.value = false
  }

  return { state: readonly(state), toggle, setTrue, setFalse }
}
