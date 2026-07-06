import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { INITIAL_ALLOWED_SLIPPAGE, DEFAULT_DEADLINE_FROM_NOW } from '../../config/constants'
import { createPersistConfig } from '../persistence/persist'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userExpertMode: boolean

  // only allow swaps on direct pairs
  userSingleHopOnly: boolean

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  audioPlay: boolean
  isDark: boolean
}

const currentTimestamp = () => new Date().getTime()

export const initialState: UserState = {
  userExpertMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  audioPlay: true,
  isDark: false,
}

const pairKey = (token0Address: string, token1Address: string) => `${token0Address};${token1Address}`

/**
 * Pure reducer for the user slice. Exposed for tests. Behaviour mirrors
 * the legacy `createReducer` exactly, including the `updateVersion`
 * reset logic for non-numeric slippage/deadline.
 */
export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'global/updateVersion':
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }
      return { ...state, lastUpdateVersionTimestamp: currentTimestamp() }
    case 'user/updateUserExpertMode':
      return {
        ...state,
        userExpertMode: action.payload.userExpertMode,
        timestamp: currentTimestamp(),
      }
    case 'user/updateUserSlippageTolerance':
      return {
        ...state,
        userSlippageTolerance: action.payload.userSlippageTolerance,
        timestamp: currentTimestamp(),
      }
    case 'user/updateUserDeadline':
      return {
        ...state,
        userDeadline: action.payload.userDeadline,
        timestamp: currentTimestamp(),
      }
    case 'user/updateUserSingleHopOnly':
      return { ...state, userSingleHopOnly: action.payload.userSingleHopOnly }
    case 'user/addSerializedToken': {
      const { serializedToken } = action.payload
      const tokens = state.tokens ?? {}
      return {
        ...state,
        tokens: {
          ...tokens,
          [serializedToken.chainId]: {
            ...(tokens[serializedToken.chainId] ?? {}),
            [serializedToken.address]: serializedToken,
          },
        },
        timestamp: currentTimestamp(),
      }
    }
    case 'user/removeSerializedToken': {
      const { address, chainId } = action.payload
      const tokens = state.tokens ?? {}
      const chainTokens = { ...(tokens[chainId] ?? {}) }
      delete chainTokens[address]
      return {
        ...state,
        tokens: { ...tokens, [chainId]: chainTokens },
        timestamp: currentTimestamp(),
      }
    }
    case 'user/addSerializedPair': {
      const { serializedPair } = action.payload
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const { chainId } = serializedPair.token0
        const pairs = state.pairs ?? {}
        const chainPairs = pairs[chainId] ?? {}
        return {
          ...state,
          pairs: {
            ...pairs,
            [chainId]: {
              ...chainPairs,
              [pairKey(serializedPair.token0.address, serializedPair.token1.address)]: serializedPair,
            },
          },
          timestamp: currentTimestamp(),
        }
      }
      return { ...state, timestamp: currentTimestamp() }
    }
    case 'user/removeSerializedPair': {
      const { chainId, tokenAAddress, tokenBAddress } = action.payload
      const pairs = state.pairs ?? {}
      if (pairs[chainId]) {
        const chainPairs = { ...pairs[chainId] }
        delete chainPairs[pairKey(tokenAAddress, tokenBAddress)]
        delete chainPairs[pairKey(tokenBAddress, tokenAAddress)]
        return { ...state, pairs: { ...pairs, [chainId]: chainPairs }, timestamp: currentTimestamp() }
      }
      return state
    }
    case 'user/muteAudio':
      return { ...state, audioPlay: false }
    case 'user/unmuteAudio':
      return { ...state, audioPlay: true }
    case 'user/toggleTheme':
      return { ...state, isDark: !state.isDark }
    default:
      return state
  }
}

export type UserAction =
  | { type: 'global/updateVersion' }
  | { type: 'user/updateUserExpertMode'; payload: { userExpertMode: boolean } }
  | { type: 'user/updateUserSingleHopOnly'; payload: { userSingleHopOnly: boolean } }
  | { type: 'user/updateUserSlippageTolerance'; payload: { userSlippageTolerance: number } }
  | { type: 'user/updateUserDeadline'; payload: { userDeadline: number } }
  | { type: 'user/addSerializedToken'; payload: { serializedToken: SerializedToken } }
  | { type: 'user/removeSerializedToken'; payload: { chainId: number; address: string } }
  | { type: 'user/addSerializedPair'; payload: { serializedPair: SerializedPair } }
  | {
      type: 'user/removeSerializedPair'
      payload: { chainId: number; tokenAAddress: string; tokenBAddress: string }
    }
  | { type: 'user/muteAudio' }
  | { type: 'user/unmuteAudio' }
  | { type: 'user/toggleTheme' }

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      () => initialState,
      createPersistConfig<UserState>('user'),
    ),
    { name: 'user' },
  ),
)

// Action functions

// NOTE: `updateVersion` is intentionally NOT exported here. The boot
// dispatch in `state/index.ts` still imports the legacy `createAction`
// from `state/global/actions`, which targets the (now-inert) legacy
// Redux user reducer. The Zustand `persist` middleware hydrates from
// localStorage on init using its initial state + any custom `migrate`,
// so an explicit `updateVersion` call after hydration isn't required
// at the current schema version (1).

export const updateUserExpertMode = (payload: { userExpertMode: boolean }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/updateUserExpertMode', payload }), false, 'user/updateUserExpertMode')
}
export const updateUserSingleHopOnly = (payload: { userSingleHopOnly: boolean }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/updateUserSingleHopOnly', payload }), false, 'user/updateUserSingleHopOnly')
}
export const updateUserSlippageTolerance = (payload: { userSlippageTolerance: number }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/updateUserSlippageTolerance', payload }), false, 'user/updateUserSlippageTolerance')
}
export const updateUserDeadline = (payload: { userDeadline: number }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/updateUserDeadline', payload }), false, 'user/updateUserDeadline')
}
export const addSerializedToken = (payload: { serializedToken: SerializedToken }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/addSerializedToken', payload }), false, 'user/addSerializedToken')
}
export const removeSerializedToken = (payload: { chainId: number; address: string }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/removeSerializedToken', payload }), false, 'user/removeSerializedToken')
}
export const addSerializedPair = (payload: { serializedPair: SerializedPair }): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/addSerializedPair', payload }), false, 'user/addSerializedPair')
}
export const removeSerializedPair = (payload: {
  chainId: number
  tokenAAddress: string
  tokenBAddress: string
}): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/removeSerializedPair', payload }), false, 'user/removeSerializedPair')
}
export const muteAudio = (): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/muteAudio' }), false, 'user/muteAudio')
}
export const unmuteAudio = (): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/unmuteAudio' }), false, 'user/unmuteAudio')
}
export const toggleTheme = (): void => {
  useUserStore.setState((state) => userReducer(state, { type: 'user/toggleTheme' }), false, 'user/toggleTheme')
}