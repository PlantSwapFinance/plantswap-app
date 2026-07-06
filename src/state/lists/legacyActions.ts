/**
 * Legacy Redux action creators preserved verbatim for the inert
 * `state/lists/reducer.ts` (still imported by `state/index.ts`'s
 * configureStore). The Zustand migration uses the same action types
 * but calls its own implementation — see `./store`.
 */
import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { TokenList, Version } from '@uniswap/token-lists'

export const fetchTokenList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{ url: string; tokenList: TokenList; requestId: string }>
  rejected: ActionCreatorWithPayload<{ url: string; errorMessage: string; requestId: string }>
}> = {
  pending: createAction('lists/fetchTokenList/pending'),
  fulfilled: createAction('lists/fetchTokenList/fulfilled'),
  rejected: createAction('lists/fetchTokenList/rejected'),
}
export const addList = createAction<string>('lists/addList')
export const removeList = createAction<string>('lists/removeList')
export const enableList = createAction<string>('lists/enableList')
export const disableList = createAction<string>('lists/disableList')
export const acceptListUpdate = createAction<string>('lists/acceptListUpdate')
export const rejectVersionUpdate = createAction<Version>('lists/rejectVersionUpdate')

export const fetchNftList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{ url: string; tokenList: TokenList; requestId: string }>
  rejected: ActionCreatorWithPayload<{ url: string; errorMessage: string; requestId: string }>
}> = {
  pending: createAction('nftLists/fetchTokenList/pending'),
  fulfilled: createAction('nftLists/fetchTokenList/fulfilled'),
  rejected: createAction('nftLists/fetchTokenList/rejected'),
}
export const addNftList = createAction<string>('nftLists/addList')
export const removeNftList = createAction<string>('nftLists/removeList')
export const enableNftList = createAction<string>('nftLists/enableList')
export const disableNftList = createAction<string>('nftLists/disableList')
export const acceptNftListUpdate = createAction<string>('nftLists/acceptListUpdate')
export const rejectNftVersionUpdate = createAction<Version>('nftLists/rejectVersionUpdate')