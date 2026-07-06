import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
// eslint-disable-next-line import/no-unresolved
import { TokenList } from '@uniswap/token-lists/dist/types'
import type { Version } from '@uniswap/token-lists'
import { DEFAULT_ACTIVE_LIST_URLS, UNSUPPORTED_LIST_URLS, DEFAULT_LIST_OF_LISTS } from '../../config/constants/lists'
import { createPersistConfig } from '../persistence/persist'

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null
      readonly pendingUpdate: TokenList | null
      readonly loadingRequestId: string | null
      readonly error: string | null
    }
  }
  readonly lastInitializedDefaultListOfLists?: string[]
  readonly activeListUrls: string[] | undefined
}

type ListState = ListsState['byUrl'][string]

const NEW_LIST_STATE: ListState = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null,
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] }

export const initialState: ListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  byUrl: {
    ...DEFAULT_LIST_OF_LISTS.concat(...UNSUPPORTED_LIST_URLS).reduce<Mutable<ListsState['byUrl']>>((memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE
      return memo
    }, {}),
  },
  activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
}

/**
 * Reducer logic ported verbatim from the legacy `createReducer` builder.
 * This is exported as a pure function so the existing reducer tests can
 * exercise it directly.
 */
export const listsReducer = (state: ListsState, action: ListsAction): ListsState => {
  switch (action.type) {
    case 'lists/fetchTokenList/pending': {
      const { requestId, url } = action.payload
      return {
        ...state,
        byUrl: {
          ...state.byUrl,
          [url]: {
            current: null,
            pendingUpdate: null,
            ...state.byUrl[url],
            loadingRequestId: requestId,
            error: null,
          },
        },
      }
    }
    case 'lists/fetchTokenList/fulfilled': {
      const { requestId, tokenList, url } = action.payload
      const current = state.byUrl[url]?.current
      const loadingRequestId = state.byUrl[url]?.loadingRequestId
      if (current) {
        const upgradeType = getVersionUpgrade(current.version, tokenList.version)
        if (upgradeType === VersionUpgrade.NONE) return state
        if (loadingRequestId === null || loadingRequestId === requestId) {
          return {
            ...state,
            byUrl: {
              ...state.byUrl,
              [url]: {
                ...state.byUrl[url],
                loadingRequestId: null,
                error: null,
                current,
                pendingUpdate: tokenList,
              },
            },
          }
        }
        return state
      }
      // Activate if on default active
      const activeListUrls = state.activeListUrls ?? []
      const updatedActive = DEFAULT_ACTIVE_LIST_URLS.includes(url) && !activeListUrls.includes(url)
        ? [...activeListUrls, url]
        : activeListUrls
      return {
        ...state,
        activeListUrls: updatedActive,
        byUrl: {
          ...state.byUrl,
          [url]: {
            ...state.byUrl[url],
            loadingRequestId: null,
            error: null,
            current: tokenList,
            pendingUpdate: null,
          },
        },
      }
    }
    case 'lists/fetchTokenList/rejected': {
      const { url, requestId, errorMessage } = action.payload
      if (state.byUrl[url]?.loadingRequestId !== requestId) return state
      return {
        ...state,
        byUrl: {
          ...state.byUrl,
          [url]: {
            ...state.byUrl[url],
            loadingRequestId: null,
            error: errorMessage,
            current: null,
            pendingUpdate: null,
          },
        },
      }
    }
    case 'lists/addList': {
      const url = action.payload
      if (!state.byUrl[url]) {
        return { ...state, byUrl: { ...state.byUrl, [url]: NEW_LIST_STATE } }
      }
      return state
    }
    case 'lists/removeList': {
      const url = action.payload
      const newByUrl = { ...state.byUrl }
      delete newByUrl[url]
      const activeListUrls = state.activeListUrls?.filter((u) => u !== url)
      return { ...state, byUrl: newByUrl, activeListUrls }
    }
    case 'lists/enableList': {
      const url = action.payload
      const byUrl = state.byUrl[url] ? state.byUrl : { ...state.byUrl, [url]: NEW_LIST_STATE }
      const activeListUrls = state.activeListUrls ?? []
      const updatedActive = activeListUrls.includes(url) ? activeListUrls : [...activeListUrls, url]
      return { ...state, byUrl, activeListUrls: updatedActive }
    }
    case 'lists/disableList': {
      const url = action.payload
      const activeListUrls = state.activeListUrls?.filter((u) => u !== url)
      return { ...state, activeListUrls }
    }
    case 'lists/acceptListUpdate': {
      const url = action.payload
      const pendingUpdate = state.byUrl[url]?.pendingUpdate
      if (!pendingUpdate) {
        throw new Error('accept list update called without pending update')
      }
      return {
        ...state,
        byUrl: {
          ...state.byUrl,
          [url]: { ...state.byUrl[url], pendingUpdate: null, current: pendingUpdate },
        },
      }
    }
    case 'global/updateVersion': {
      let nextByUrl = state.byUrl
      let nextActiveListUrls = state.activeListUrls
      if (!state.lastInitializedDefaultListOfLists) {
        nextByUrl = initialState.byUrl
        nextActiveListUrls = initialState.activeListUrls
      } else {
        const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
          (s, l) => s.add(l),
          new Set(),
        )
        const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set())
        DEFAULT_LIST_OF_LISTS.forEach((listUrl) => {
          if (!lastInitializedSet.has(listUrl)) {
            nextByUrl = { ...nextByUrl, [listUrl]: NEW_LIST_STATE }
          }
        })
        state.lastInitializedDefaultListOfLists.forEach((listUrl) => {
          if (!newListOfListsSet.has(listUrl)) {
            const filtered = { ...nextByUrl }
            delete filtered[listUrl]
            nextByUrl = filtered
          }
        })
      }
      if (!nextActiveListUrls) {
        nextActiveListUrls = DEFAULT_ACTIVE_LIST_URLS
        DEFAULT_ACTIVE_LIST_URLS.forEach((listUrl: string) => {
          if (!nextByUrl[listUrl]) {
            nextByUrl = { ...nextByUrl, [listUrl]: NEW_LIST_STATE }
          }
        })
      }
      return {
        ...state,
        byUrl: nextByUrl,
        activeListUrls: nextActiveListUrls,
        lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
      }
    }
    default:
      return state
  }
}

export type ListsAction =
  | { type: 'lists/fetchTokenList/pending'; payload: { url: string; requestId: string } }
  | { type: 'lists/fetchTokenList/fulfilled'; payload: { url: string; tokenList: TokenList; requestId: string } }
  | { type: 'lists/fetchTokenList/rejected'; payload: { url: string; errorMessage: string; requestId: string } }
  | { type: 'lists/addList'; payload: string }
  | { type: 'lists/removeList'; payload: string }
  | { type: 'lists/enableList'; payload: string }
  | { type: 'lists/disableList'; payload: string }
  | { type: 'lists/acceptListUpdate'; payload: string }
  | { type: 'global/updateVersion' }

export const useListsStore = create<ListsState>()(
  devtools(
    persist(
      () => initialState,
      createPersistConfig<ListsState>('lists'),
    ),
    { name: 'lists' },
  ),
)

// Action functions

export const fetchTokenListPending = (payload: { url: string; requestId: string }): void => {
  useListsStore.setState((state) => listsReducer(state, { type: 'lists/fetchTokenList/pending', payload }), false, 'lists/fetchTokenList/pending')
}
export const fetchTokenListFulfilled = (payload: { url: string; tokenList: TokenList; requestId: string }): void => {
  useListsStore.setState(
    (state) => listsReducer(state, { type: 'lists/fetchTokenList/fulfilled', payload }),
    false,
    'lists/fetchTokenList/fulfilled',
  )
}
export const fetchTokenListRejected = (payload: { url: string; errorMessage: string; requestId: string }): void => {
  useListsStore.setState(
    (state) => listsReducer(state, { type: 'lists/fetchTokenList/rejected', payload }),
    false,
    'lists/fetchTokenList/rejected',
  )
}
export const addList = (payload: string): void => {
  useListsStore.setState((state) => listsReducer(state, { type: 'lists/addList', payload }), false, 'lists/addList')
}
export const removeList = (payload: string): void => {
  useListsStore.setState((state) => listsReducer(state, { type: 'lists/removeList', payload }), false, 'lists/removeList')
}
export const enableList = (payload: string): void => {
  useListsStore.setState((state) => listsReducer(state, { type: 'lists/enableList', payload }), false, 'lists/enableList')
}
export const disableList = (payload: string): void => {
  useListsStore.setState((state) => listsReducer(state, { type: 'lists/disableList', payload }), false, 'lists/disableList')
}
export const acceptListUpdate = (payload: string): void => {
  useListsStore.setState(
    (state) => listsReducer(state, { type: 'lists/acceptListUpdate', payload }),
    false,
    'lists/acceptListUpdate',
  )
}
// rejectVersionUpdate is exported for backwards compat but isn't wired into
// the reducer (matches pre-migration behaviour).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const rejectVersionUpdate = (_payload: Version): void => {
  // no-op
}
