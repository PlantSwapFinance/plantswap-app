/**
 * Re-export the lists action surface for backwards compatibility.
 *
 * After the Zustand migration the legacy `createAction` triplets
 * (`fetchTokenList.pending/fulfilled/rejected`) are replaced by
 * standalone functions in `./store` that mutate the store directly. The
 * legacy object shape is preserved here as a tiny facade so existing
 * imports of the form `import { fetchTokenList } from 'state/lists/actions'`
 * continue to compile — `fetchTokenList.pending(payload)` now resolves
 * to the Zustand action.
 */
import { Version } from '@uniswap/token-lists'
import {
  fetchTokenListPending,
  fetchTokenListFulfilled,
  fetchTokenListRejected,
  fetchNftListPending,
  fetchNftListFulfilled,
  fetchNftListRejected,
} from './store'

export {
  fetchTokenListPending as pending,
  fetchTokenListFulfilled as fulfilled,
  fetchTokenListRejected as rejected,
  addList,
  removeList,
  enableList,
  disableList,
  acceptListUpdate,
  rejectVersionUpdate,
  fetchNftListPending,
  fetchNftListFulfilled,
  fetchNftListRejected,
  addNftList,
  removeNftList,
  enableNftList,
  disableNftList,
  acceptNftListUpdate,
  rejectNftVersionUpdate,
} from './store'

// Preserve the `fetchTokenList` namespace object for any caller that
// accesses `.pending/.fulfilled/.rejected` properties.
export const fetchTokenList = {
  pending: fetchTokenListPending,
  fulfilled: fetchTokenListFulfilled,
  rejected: fetchTokenListRejected,
}

export const fetchNftList = {
  pending: fetchNftListPending,
  fulfilled: fetchNftListFulfilled,
  rejected: fetchNftListRejected,
}

// Suppress unused warning — Version is part of the public type surface.
export type { Version }