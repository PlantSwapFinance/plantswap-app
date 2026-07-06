/**
 * One-shot migration from `redux-localstorage-simple` to Zustand `persist`.
 *
 * `redux-localstorage-simple` writes a separate localStorage key per persisted
 * slice, named `redux_localstorage_simple_<stateName>`. Zustand's `persist`
 * middleware wraps the stored value in `{ state, version }`.
 *
 * This helper is called once on app boot, before any persisted store is
 * constructed. For each persisted slice that still has a legacy key but no
 * Zustand-style key, it copies the raw JSON value into the new `plantswap.*`
 * key in the wrapper shape Zustand expects, then deletes the legacy key.
 *
 * Safe to call repeatedly: it no-ops once the migration flag is set.
 */
const LEGACY_NAMESPACE = 'redux_localstorage_simple'
const LEGACY_SEPARATOR = '_'
const NEW_NAMESPACE = 'plantswap'
const NEW_SEPARATOR = '.'
const MIGRATION_FLAG = `${NEW_NAMESPACE}${NEW_SEPARATOR}migratedFromLegacy`

// Mirror of src/state/index.ts PERSISTED_KEYS, minus the dead 'nftLists'
// reference that has no corresponding reducer today.
const PERSISTED_KEYS = ['user', 'transactions', 'lists'] as const

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

/**
 * Wrap a raw persisted slice value in the `{ state, version }` envelope
 * Zustand's `persist` middleware expects.
 */
const wrapForZustand = (rawState: unknown) => ({
  state: rawState,
  version: 1,
})

export const migrateLegacyLocalStorage = (): void => {
  if (!isBrowser) return

  try {
    if (window.localStorage.getItem(MIGRATION_FLAG) === '1') return

    let migratedAny = false

    PERSISTED_KEYS.forEach((key) => {
      const legacyKey = `${LEGACY_NAMESPACE}${LEGACY_SEPARATOR}${key}`
      const newKey = `${NEW_NAMESPACE}${NEW_SEPARATOR}${key}`

      const legacyRaw = window.localStorage.getItem(legacyKey)
      const existingNew = window.localStorage.getItem(newKey)

      // Only seed the new key when the legacy value exists and the new key
      // does not. We never overwrite a freshly written Zustand value — that
      // would clobber any state the user changed between app loads.
      if (legacyRaw !== null && existingNew === null) {
        try {
          const parsed = JSON.parse(legacyRaw)
          window.localStorage.setItem(newKey, JSON.stringify(wrapForZustand(parsed)))
          migratedAny = true
        } catch {
          // Corrupt legacy blob — leave it untouched, don't seed garbage.
        }
      }

      // Remove the legacy key regardless. We've either migrated it or
      // determined it was empty / corrupt; either way Redux is gone after
      // the final phase and the legacy key would otherwise be orphaned.
      if (legacyRaw !== null) {
        window.localStorage.removeItem(legacyKey)
        migratedAny = true
      }
    })

    if (migratedAny) {
      window.localStorage.setItem(MIGRATION_FLAG, '1')
    }
  } catch {
    // localStorage can throw (private mode, quota, etc.). Swallow — migration
    // is a best-effort convenience; the app must still work without it.
  }
}