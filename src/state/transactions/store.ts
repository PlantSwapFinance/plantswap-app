import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ChainId } from '@pancakeswap/sdk'
import { createPersistConfig } from '../persistence/persist'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

const now = () => new Date().getTime()

/**
 * Pure reducer for the transactions slice. Mirrors the legacy
 * `createReducer` behaviour exactly (including the throw on duplicate
 * add and the no-op when checkedTransaction/finalizeTransaction target a
 * missing tx).
 */
export const transactionsReducer = (state: TransactionState, action: TransactionsAction): TransactionState => {
  switch (action.type) {
    case 'transactions/addTransaction': {
      const { chainId, from, hash, approval, summary, claim } = action.payload
      if (state[chainId]?.[hash]) {
        throw Error('Attempted to add existing transaction.')
      }
      const txs = state[chainId] ?? {}
      return {
        ...state,
        [chainId]: {
          ...txs,
          [hash]: { hash, approval, summary, claim, from, addedTime: now() },
        },
      }
    }
    case 'transactions/clearAllTransactions': {
      const { chainId } = action.payload
      if (!state[chainId]) return state
      return { ...state, [chainId]: {} }
    }
    case 'transactions/checkedTransaction': {
      const { chainId, hash, blockNumber } = action.payload
      const tx = state[chainId]?.[hash]
      if (!tx) return state
      const lastCheckedBlockNumber = tx.lastCheckedBlockNumber
        ? Math.max(blockNumber, tx.lastCheckedBlockNumber)
        : blockNumber
      return {
        ...state,
        [chainId]: {
          ...state[chainId],
          [hash]: { ...tx, lastCheckedBlockNumber },
        },
      }
    }
    case 'transactions/finalizeTransaction': {
      const { chainId, hash, receipt } = action.payload
      const tx = state[chainId]?.[hash]
      if (!tx) return state
      return {
        ...state,
        [chainId]: {
          ...state[chainId],
          [hash]: { ...tx, receipt, confirmedTime: now() },
        },
      }
    }
    default:
      return state
  }
}

export type TransactionsAction =
  | {
      type: 'transactions/addTransaction'
      payload: {
        chainId: ChainId
        hash: string
        from: string
        approval?: { tokenAddress: string; spender: string }
        claim?: { recipient: string }
        summary?: string
      }
    }
  | { type: 'transactions/clearAllTransactions'; payload: { chainId: ChainId } }
  | {
      type: 'transactions/checkedTransaction'
      payload: { chainId: ChainId; hash: string; blockNumber: number }
    }
  | {
      type: 'transactions/finalizeTransaction'
      payload: { chainId: ChainId; hash: string; receipt: SerializableTransactionReceipt }
    }

export const useTransactionsStore = create<TransactionState>()(
  devtools(
    persist(
      () => initialState,
      createPersistConfig<TransactionState>('transactions'),
    ),
    { name: 'transactions' },
  ),
)

export const addTransaction = (payload: {
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
}): void => {
  useTransactionsStore.setState((state) => transactionsReducer(state, { type: 'transactions/addTransaction', payload }), false, 'transactions/addTransaction')
}

export const clearAllTransactions = (payload: { chainId: ChainId }): void => {
  useTransactionsStore.setState(
    (state) => transactionsReducer(state, { type: 'transactions/clearAllTransactions', payload }),
    false,
    'transactions/clearAllTransactions',
  )
}

export const checkedTransaction = (payload: { chainId: ChainId; hash: string; blockNumber: number }): void => {
  useTransactionsStore.setState(
    (state) => transactionsReducer(state, { type: 'transactions/checkedTransaction', payload }),
    false,
    'transactions/checkedTransaction',
  )
}

export const finalizeTransaction = (payload: {
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
}): void => {
  useTransactionsStore.setState(
    (state) => transactionsReducer(state, { type: 'transactions/finalizeTransaction', payload }),
    false,
    'transactions/finalizeTransaction',
  )
}