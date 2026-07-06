import { nanoid } from 'nanoid'
import { ChainId } from '@pancakeswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import resolveListFromUrl from '../utils/getTokenList'
import resolveENSContentHash from '../utils/ENS/resolveENSContentHash'
import useWeb3Provider from './useActiveWeb3React'

type FetcherActions = {
  fetchPending: (payload: { requestId: string; url: string }) => void
  fetchFulfilled: (payload: { url: string; tokenList: TokenList; requestId: string }) => void
  fetchRejected: (payload: { url: string; requestId: string; errorMessage: string }) => void
}

function useFetchListCallback(actions: FetcherActions): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { library } = useWeb3Provider()
  const { chainId } = useActiveWeb3React()
  const { fetchPending, fetchFulfilled, fetchRejected } = actions

  const ensResolver = useCallback(
    (ensName: string) => {
      if (chainId !== ChainId.MAINNET) {
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library],
  )

  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      if (sendDispatch) {
        fetchPending({ requestId, url: listUrl })
      }
      return resolveListFromUrl(listUrl, ensResolver)
        .then((tokenList) => {
          if (sendDispatch) {
            fetchFulfilled({ url: listUrl, tokenList, requestId })
          }
          return tokenList
        })
        .catch((error) => {
          console.error(`Failed to get list at url ${listUrl}`, error)
          if (sendDispatch) {
            fetchRejected({ url: listUrl, requestId, errorMessage: error.message })
          }
          throw error
        })
    },
    [ensResolver, fetchPending, fetchFulfilled, fetchRejected],
  )
}

export default useFetchListCallback
