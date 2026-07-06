import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { toCallKey } from './actions'

export interface MulticallState {
  callListeners?: {
    [chainId: number]: {
      [callKey: string]: {
        [blocksPerFetch: number]: number
      }
    }
  }

  callResults: {
    [chainId: number]: {
      [callKey: string]: {
        data?: string | null
        blockNumber?: number
        fetchingBlockNumber?: number
      }
    }
  }
}

export const initialState: MulticallState = {
  callResults: {},
}

export const useMulticallStore = create<MulticallState>()(
  devtools(
    () => initialState,
    { name: 'multicall' },
  ),
)

/**
 * Pure reducer for the multicall slice. Mirrors the legacy
 * `createReducer` behaviour 1:1, including ref counting for active
 * listeners and stale-update protection on fetching/results.
 */
export const multicallReducer = (state: MulticallState, action: MulticallAction): MulticallState => {
  switch (action.type) {
    case 'multicall/addMulticallListeners': {
      const { calls, chainId, options } = action.payload
      const blocksPerFetch = options?.blocksPerFetch ?? 1
      const listeners: MulticallState['callListeners'] = state.callListeners
        ? { ...state.callListeners }
        : {}
      const chainListeners: MulticallState['callListeners'][number] = { ...(listeners[chainId] ?? {}) }
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const bucket: { [k: number]: number } = { ...(chainListeners[callKey] ?? {}) }
        bucket[blocksPerFetch] = (bucket[blocksPerFetch] ?? 0) + 1
        chainListeners[callKey] = bucket
      })
      listeners[chainId] = chainListeners
      return { ...state, callListeners: listeners }
    }
    case 'multicall/removeMulticallListeners': {
      const { chainId, calls, options } = action.payload
      const blocksPerFetch = options?.blocksPerFetch ?? 1
      const listeners = state.callListeners
      if (!listeners || !listeners[chainId]) return state
      const chainListeners: { [callKey: string]: { [k: number]: number } } = { ...listeners[chainId] }
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const bucket = chainListeners[callKey]
        if (!bucket) return
        const updated: { [k: number]: number } = { ...bucket }
        if (!updated[blocksPerFetch]) return
        if (updated[blocksPerFetch] === 1) {
          delete updated[blocksPerFetch]
        } else {
          updated[blocksPerFetch]--
        }
        if (Object.keys(updated).length === 0) {
          delete chainListeners[callKey]
        } else {
          chainListeners[callKey] = updated
        }
      })
      return { ...state, callListeners: { ...listeners, [chainId]: chainListeners } }
    }
    case 'multicall/fetchingMulticallResults': {
      const { chainId, fetchingBlockNumber, calls } = action.payload
      const chainResults: MulticallState['callResults'][number] = { ...(state.callResults[chainId] ?? {}) }
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = chainResults[callKey]
        if (!current) {
          chainResults[callKey] = { fetchingBlockNumber }
        } else if ((current.fetchingBlockNumber ?? 0) < fetchingBlockNumber) {
          chainResults[callKey] = { ...current, fetchingBlockNumber }
        }
      })
      return { ...state, callResults: { ...state.callResults, [chainId]: chainResults } }
    }
    case 'multicall/errorFetchingMulticallResults': {
      const { fetchingBlockNumber, chainId, calls } = action.payload
      const chainResults = state.callResults[chainId]
      if (!chainResults) return state
      const updatedChain: MulticallState['callResults'][number] = { ...chainResults }
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = updatedChain[callKey]
        if (!current) return
        if (current.fetchingBlockNumber === fetchingBlockNumber) {
          updatedChain[callKey] = {
            data: null,
            blockNumber: fetchingBlockNumber,
          }
        }
      })
      return { ...state, callResults: { ...state.callResults, [chainId]: updatedChain } }
    }
    case 'multicall/updateMulticallResults': {
      const { chainId, results, blockNumber } = action.payload
      const chainResults: MulticallState['callResults'][number] = { ...(state.callResults[chainId] ?? {}) }
      Object.keys(results).forEach((callKey) => {
        const current = chainResults[callKey]
        if ((current?.blockNumber ?? 0) > blockNumber) return
        chainResults[callKey] = { data: results[callKey], blockNumber }
      })
      return { ...state, callResults: { ...state.callResults, [chainId]: chainResults } }
    }
    default:
      return state
  }
}

export type MulticallAction =
  | {
      type: 'multicall/addMulticallListeners'
      payload: {
        chainId: number
        calls: { address: string; callData: string }[]
        options?: { blocksPerFetch?: number }
      }
    }
  | {
      type: 'multicall/removeMulticallListeners'
      payload: {
        chainId: number
        calls: { address: string; callData: string }[]
        options?: { blocksPerFetch?: number }
      }
    }
  | {
      type: 'multicall/fetchingMulticallResults'
      payload: { chainId: number; fetchingBlockNumber: number; calls: { address: string; callData: string }[] }
    }
  | {
      type: 'multicall/errorFetchingMulticallResults'
      payload: { chainId: number; fetchingBlockNumber: number; calls: { address: string; callData: string }[] }
    }
  | {
      type: 'multicall/updateMulticallResults'
      payload: { chainId: number; blockNumber: number; results: { [callKey: string]: string | null } }
    }

// Action functions

export const addMulticallListeners = (payload: MulticallAction extends { type: 'multicall/addMulticallListeners'; payload: infer P } ? P : never): void => {
  useMulticallStore.setState((state) => multicallReducer(state, { type: 'multicall/addMulticallListeners', payload }), false, 'multicall/addMulticallListeners')
}

export const removeMulticallListeners = (payload: MulticallAction extends { type: 'multicall/removeMulticallListeners'; payload: infer P } ? P : never): void => {
  useMulticallStore.setState((state) => multicallReducer(state, { type: 'multicall/removeMulticallListeners', payload }), false, 'multicall/removeMulticallListeners')
}

export const fetchingMulticallResults = (payload: MulticallAction extends { type: 'multicall/fetchingMulticallResults'; payload: infer P } ? P : never): void => {
  useMulticallStore.setState((state) => multicallReducer(state, { type: 'multicall/fetchingMulticallResults', payload }), false, 'multicall/fetchingMulticallResults')
}

export const errorFetchingMulticallResults = (payload: MulticallAction extends { type: 'multicall/errorFetchingMulticallResults'; payload: infer P } ? P : never): void => {
  useMulticallStore.setState((state) => multicallReducer(state, { type: 'multicall/errorFetchingMulticallResults', payload }), false, 'multicall/errorFetchingMulticallResults')
}

export const updateMulticallResults = (payload: MulticallAction extends { type: 'multicall/updateMulticallResults'; payload: infer P } ? P : never): void => {
  useMulticallStore.setState((state) => multicallReducer(state, { type: 'multicall/updateMulticallResults', payload }), false, 'multicall/updateMulticallResults')
}