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
// add and remove from list options
export const addList = createAction<string>('lists/addList')
export const removeList = createAction<string>('lists/removeList')

// select which lists to search across from loaded lists
export const enableList = createAction<string>('lists/enableList')
export const disableList = createAction<string>('lists/disableList')

// versioning
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
// add and remove from list options
export const addNftList = createAction<string>('nftLists/addList')
export const removeNftList = createAction<string>('nftLists/removeList')

// select which lists to search across from loaded lists
export const enableNftList = createAction<string>('nftLists/enableList')
export const disableNftList = createAction<string>('nftLists/disableList')

// versioning
export const acceptNftListUpdate = createAction<string>('nftLists/acceptListUpdate')
export const rejectNftVersionUpdate = createAction<Version>('nftLists/rejectVersionUpdate')
