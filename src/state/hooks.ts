import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Nfts from 'config/constants/nfts'
import { fetchWalletNfts, useCollectiblesStore } from './collectibles/store'

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useWeb3React()
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