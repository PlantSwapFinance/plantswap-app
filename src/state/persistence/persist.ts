import { persist, createJSONStorage, PersistOptions, StorageValue } from 'zustand/middleware'

/**
 * Project defaults for `zustand/middleware` `persist`.
 *
 * Centralises the localStorage key prefix and schema version so every
 * persisted slice uses the same naming and versioning conventions.
 *
 * Usage:
 *
 *   export const useUserStore = create<UserState>()(
 *     persist(
 *       (set) => ({ ...initialState, ...actions(set) }),
 *       createPersistConfig<UserState>('user'),
 *     ),
 *   )
 */
export const PERSIST_NAMESPACE = 'plantswap'
export const PERSIST_VERSION = 1

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

/**
 * Returns a `PersistOptions` configured with project defaults. Pass any
 * slice-specific overrides in the second argument (e.g. `partialize`,
 * `migrate`, `version`).
 */
export const createPersistConfig = <T>(
  sliceName: string,
  overrides?: Omit<PersistOptions<T>, 'name' | 'version' | 'storage'>,
): PersistOptions<T> => ({
  name: `${PERSIST_NAMESPACE}.${sliceName}`,
  version: PERSIST_VERSION,
  storage: createJSONStorage<T>(() =>
    isBrowser ? window.localStorage : noopStorage,
  ),
  ...overrides,
})

/**
 * Inert storage used in non-browser environments (SSR, tests with no jsdom
 * localStorage). Zustand's persist requires *some* storage; this satisfies
 * the contract without touching real localStorage.
 */
const noopStorage = {
  getItem: (): StorageValue<unknown> | null => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setItem: (_name: string, _value: StorageValue<unknown>): void => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  removeItem: (_name: string): void => undefined,
} as unknown as Storage

export { persist }