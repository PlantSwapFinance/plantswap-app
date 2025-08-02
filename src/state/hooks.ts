import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import Nfts from 'config/constants/nfts'
import { State } from './types'
import { fetchWalletNfts } from './collectibles'

// /!\
// Don't add anything here. These hooks will be moved the the predictions folder

// Collectibles
export const useGetCollectibles = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}
