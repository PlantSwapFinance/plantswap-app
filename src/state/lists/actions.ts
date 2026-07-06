// Backwards-compatible re-export of the lists action surface.
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

// Preserve the `fetchTokenList` namespace object.
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

export type { Version }