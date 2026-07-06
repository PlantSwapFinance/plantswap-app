/**
 * Legacy Redux action creators preserved verbatim for the inert
 * `state/user/reducer.ts` (still imported by `state/index.ts`'s
 * configureStore). These mirror the action types the original slice
 * registered with `createReducer`. The Zustand migration uses the
 * action types but calls its own implementation — see `./store`.
 */
import { createAction } from '@reduxjs/toolkit'
import type { SerializedToken, SerializedPair } from './store'

export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('user/updateUserExpertMode')
export const updateUserSingleHopOnly = createAction<{ userSingleHopOnly: boolean }>('user/updateUserSingleHopOnly')
export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>(
  'user/updateUserSlippageTolerance',
)
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')
export const addSerializedToken = createAction<{ serializedToken: SerializedToken }>('user/addSerializedToken')
export const removeSerializedToken = createAction<{ chainId: number; address: string }>('user/removeSerializedToken')
export const addSerializedPair = createAction<{ serializedPair: SerializedPair }>('user/addSerializedPair')
export const removeSerializedPair =
  createAction<{ chainId: number; tokenAAddress: string; tokenBAddress: string }>('user/removeSerializedPair')
export const muteAudio = createAction<void>('user/muteAudio')
export const unmuteAudio = createAction<void>('user/unmuteAudio')
export const toggleTheme = createAction<void>('user/toggleTheme')