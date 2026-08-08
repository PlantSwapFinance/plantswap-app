import { useEffect } from 'react'
import Nfts from 'config/constants/nfts'
import { fetchWalletNfts, useCollectiblesStore } from './collectibles/store'
import useActiveWeb3React from '../hooks/useActiveWeb3React'

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useActiveWeb3React()
  // Select primitives separately — returning a new object from the selector
  // every call breaks React 18's getSnapshot caching and causes max update depth.
  const isInitialized = useCollectiblesStore((state) => state.isInitialized)
  const isLoading = useCollectiblesStore((state) => state.isLoading)
  const data = useCollectiblesStore((state) => state.data)
  const identifiers = Object.keys(data)

  useEffect(() => {
    if (account && !isInitialized) {
      fetchWalletNfts(account)
    }
  }, [isInitialized, account])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}
