/**
 * Public state barrel.
 *
 * After the Zustand migration, this module re-exports the compatibility
 * `useAppDispatch` shim and the type aliases used by the small set of
 * view files that haven't yet been rewritten to drop `dispatch(...)`.
 *
 * Historical note: this module used to host the Redux `configureStore`
 * call (which imported all 23 slices and registered the
 * `redux-localstorage-simple` middleware). That machinery has been
 * fully replaced by per-slice Zustand stores in `state/<slice>/store.ts`.
 */

// Compatibility shim — replaces react-redux's `useDispatch`.
// See `./storeUtils.ts` for the implementation.
export { useAppDispatch } from './storeUtils'

// Type aliases kept for backwards compatibility. They now resolve to
// loosely-typed `unknown` so legacy view files that import them still
// compile, but the runtime store layout lives in the per-slice
// `state/<slice>/store.ts` modules.
export type AppDispatch = (action: unknown) => unknown
export type AppState = Record<string, unknown>

export default null