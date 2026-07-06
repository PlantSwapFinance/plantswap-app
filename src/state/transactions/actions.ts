// Re-export the transactions action surface for backwards compatibility.
// The legacy createAction creators are now thin wrappers around the
// Zustand store mutations in `./store`.
export {
  addTransaction,
  clearAllTransactions,
  finalizeTransaction,
  checkedTransaction,
} from './store'
export type { SerializableTransactionReceipt } from './store'