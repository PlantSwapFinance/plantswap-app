import { useEffect } from 'react'
import Nfts from 'config/constants/nfts'
import { fetchWalletNfts, useCollectiblesStore } from './collectibles/store'
import useActiveWeb3React from '../hooks/useActiveWeb3React'

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useActiveWeb3React()
  const { isInitialized, isLoading, data } = useCollectiblesStore((state) => ({
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
    data: state.data,
  }))
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
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
