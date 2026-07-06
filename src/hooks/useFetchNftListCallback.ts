import { nanoid } from 'nanoid'
import { ChainId } from '@pancakeswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  fetchNftListFulfilled,
  fetchNftListPending,
  fetchNftListRejected,
} from '../state/lists/store'
import getNftList from '../utils/getNftList'
import resolveENSContentHash from '../utils/ENS/resolveENSContentHash'
import useWeb3Provider from './useActiveWeb3React'

function useFetchNftListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
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
        fetchNftListPending({ requestId, url: listUrl })
      }
      return getNftList(listUrl, ensResolver)
        .then((tokenList) => {
          if (sendDispatch) {
            fetchNftListFulfilled({ url: listUrl, tokenList, requestId })
          }
          return tokenList
        })
        .catch((error) => {
          console.error(`Failed to get list at url ${listUrl}`, error)
          if (sendDispatch) {
            fetchNftListRejected({ url: listUrl, requestId, errorMessage: error.message })
          }
          throw error
        })
    },
    [ensResolver],
  )
}

export default useFetchNftListCallback