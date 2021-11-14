import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@pancakeswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppDispatch } from '../state'
import { fetchNftList } from '../state/lists/actions'
import getNftList from '../utils/getNftList'
import resolveENSContentHash from '../utils/ENS/resolveENSContentHash'
import useWeb3Provider from './useActiveWeb3React'

function useFetchNftListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { library } = useWeb3Provider()
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  const ensResolver = useCallback(
    (ensName: string) => {
      if (chainId !== ChainId.MAINNET) {
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library],
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      if (sendDispatch) {
        dispatch(fetchNftList.pending({ requestId, url: listUrl }))
      }
      return getNftList(listUrl, ensResolver)
        .then((tokenList) => {
          if (sendDispatch) {
            dispatch(fetchNftList.fulfilled({ url: listUrl, tokenList, requestId }))
          }
          return tokenList
        })
        .catch((error) => {
          console.error(`Failed to get list at url ${listUrl}`, error)
          if (sendDispatch) {
            dispatch(fetchNftList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          }
          throw error
        })
    },
    [dispatch, ensResolver],
  )
}

export default useFetchNftListCallback
