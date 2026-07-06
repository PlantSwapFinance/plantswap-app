/**
 * Compatibility shim for the legacy `useAppDispatch` API.
 *
 * After the Zustand migration, action functions like `fetchFarmUserData`
 * are plain functions that mutate the Zustand store directly and return
 * void. The legacy `dispatch(thunk(args))` pattern still "works" because
 * the inner function executes its side effects and Redux's
 * `dispatch(undefined)` is a no-op.
 *
 * This shim replaces the react-redux `useDispatch` so the 38 view files
 * that haven't been rewritten yet continue to function without depending
 * on react-redux at runtime. The shim's returned function calls the
 * passed action if it's a function (treating it as a Zustand action),
 * otherwise returns it as a no-op (treating it as a Redux action object).
 */
export const useAppDispatch = () => (action: unknown) => {
  if (typeof action === 'function') {
    return (action as () => unknown)()
  }
  return action
}