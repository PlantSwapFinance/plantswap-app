import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
}

const initialState: ApplicationState = {
  blockNumber: {},
}

export interface UpdateBlockNumberPayload {
  chainId: number
  blockNumber: number
}

/**
 * Pure reducer for the application slice. Exported separately so tests can
 * exercise it without spinning up a Zustand store. Behaviour mirrors the
 * original `createReducer` exactly: monotonically increasing blockNumber
 * per chainId, no-op for regressions.
 */
export const applicationReducer = (state: ApplicationState, payload: UpdateBlockNumberPayload): ApplicationState => {
  const { chainId, blockNumber } = payload
  if (typeof state.blockNumber[chainId] !== 'number') {
    return {
      blockNumber: { ...state.blockNumber, [chainId]: blockNumber },
    }
  }
  return {
    blockNumber: {
      ...state.blockNumber,
      [chainId]: Math.max(blockNumber, state.blockNumber[chainId]),
    },
  }
}

export const useApplicationStore = create<ApplicationState>()(
  devtools(
    () => initialState,
    { name: 'application' },
  ),
)

/**
 * Dispatch the latest blockNumber for a chainId. Monotonic per chain.
 */
export const updateBlockNumber = (payload: UpdateBlockNumberPayload): void => {
  useApplicationStore.setState((state) => applicationReducer(state, payload), false, 'application/updateBlockNumber')
}