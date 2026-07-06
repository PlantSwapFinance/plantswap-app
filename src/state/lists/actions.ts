// Backwards-compatible re-export of the lists action surface.
import { Version } from '@uniswap/token-lists'
import {
  fetchTokenListPending,
  fetchTokenListFulfilled,
  fetchTokenListRejected,
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
} from './store'

// Preserve the `fetchTokenList` namespace object.
export const fetchTokenList = {
  pending: fetchTokenListPending,
  fulfilled: fetchTokenListFulfilled,
  rejected: fetchTokenListRejected,
}

export type { Version }
