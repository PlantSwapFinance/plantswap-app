import { nanoid } from 'nanoid'
import { ChainId } from '@pancakeswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  fetchTokenListFulfilled,
  fetchTokenListPending,
  fetchTokenListRejected,
} from '../state/lists/store'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/ENS/resolveENSContentHash'
import useWeb3Provider from './useActiveWeb3React'

function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { library } = useWeb3Provider()
  const { chainId } = useActiveWeb3React()

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
        fetchTokenListPending({ requestId, url: listUrl })
      }
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          if (sendDispatch) {
            fetchTokenListFulfilled({ url: listUrl, tokenList, requestId })
          }
          return tokenList
        })
        .catch((error) => {
          console.error(`Failed to get list at url ${listUrl}`, error)
          if (sendDispatch) {
            fetchTokenListRejected({ url: listUrl, requestId, errorMessage: error.message })
          }
          throw error
        })
    },
    [ensResolver],
  )
}

export default useFetchListCallback