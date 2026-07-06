/**
 * Re-export of the user slice action surface for backwards compatibility.
 *
 * After the Zustand migration the legacy `createAction` creators have
 * been replaced by direct store mutations in `./store`. This module now
 * re-exports the canonical action surface so existing imports
 * (`import { updateUserExpertMode } from 'state/user/actions'`) keep
 * working — they now resolve to the Zustand action functions.
 *
 * NOTE: `updateVersion` is exported from `./store` here, shadowing the
 * legacy `createAction` from `../global/actions`. View consumers should
 * import from `state/user/actions` to get the Zustand action. The boot
 * dispatch in `state/index.ts` still imports the legacy action from
 * `../global/actions` so it can target the Redux reducer.
 */

export {
  updateUserExpertMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  updateUserDeadline,
  addSerializedToken,
  removeSerializedToken,
  addSerializedPair,
  removeSerializedPair,
  muteAudio,
  unmuteAudio,
  toggleTheme,
} from './store'

export type { SerializedToken, SerializedPair } from './store'