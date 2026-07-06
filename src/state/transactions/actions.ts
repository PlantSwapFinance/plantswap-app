// Backwards-compatible re-export of the transactions action surface.
export {
  addTransaction,
  clearAllTransactions,
  finalizeTransaction,
  checkedTransaction,
} from './store'
export type { SerializableTransactionReceipt } from './store'