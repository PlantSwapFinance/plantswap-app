/**
 * Legacy Redux action creators preserved verbatim for the inert
 * `state/transactions/reducer.ts` (still imported by `state/index.ts`'s
 * configureStore). The Zustand migration uses the same action types
 * but calls its own implementation — see `./store`.
 */
import { createAction } from '@reduxjs/toolkit'
import { ChainId } from '@pancakeswap/sdk'

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: ChainId }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: any
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')