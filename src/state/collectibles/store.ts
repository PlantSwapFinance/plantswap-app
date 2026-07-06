import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CollectiblesState } from 'state/types'
import { nftSources } from 'config/constants/nfts'
import { NftType } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { getNftByTokenId } from 'utils/collectibles'
import { ethers } from 'ethers'

export const initialState: CollectiblesState = {
  isInitialized: false,
  isLoading: true,
  data: {},
}

export const useCollectiblesStore = create<CollectiblesState>()(
  devtools(
    () => initialState,
    { name: 'collectibles' },
  ),
)

type NftSourceItem = [number, string]

/**
 * Async thunk replacement — fetches all NFT tokenIds owned by `account`
 * across every registered nftSource and groups them by identifier in the
 * store. Behaviour matches the original `fetchWalletNfts` exactly.
 */
export const fetchWalletNfts = async (account: string): Promise<void> => {
  useCollectiblesStore.setState({ isLoading: true }, false, 'collectibles/fetchWalletNfts/pending')

  const nftSourcePromises = Object.keys(nftSources).map(async (nftSourceType) => {
    const { address: addressObj } = nftSources[nftSourceType as NftType]
    const address = getAddress(addressObj)
    const contract = getErc721Contract(address)

    const getTokenIdAndData = async (index: number) => {
      try {
        const tokenIdBn: ethers.BigNumber = await contract.tokenOfOwnerByIndex(account, index)
        const tokenId = tokenIdBn.toNumber()

        const walletNft = await getNftByTokenId(address, tokenId)
        return [tokenId, walletNft.identifier]
      } catch (error) {
        console.error('getTokenIdAndData', error)
        return null
      }
    }

    const balanceOfResponse = await contract.balanceOf(account)
    const balanceOf = balanceOfResponse.toNumber()

    if (balanceOf === 0) {
      return []
    }

    const nftDataFetchPromises = []
    for (let i = 0; i < balanceOf; i++) {
      nftDataFetchPromises.push(getTokenIdAndData(i))
    }
    const nftData = await Promise.all(nftDataFetchPromises)
    return nftData
  })

  const nftSourceData = await Promise.all(nftSourcePromises)
  const flat = nftSourceData.flat()

  useCollectiblesStore.setState(
    (state) => ({
      isLoading: false,
      isInitialized: true,
      data: flat.reduce<CollectiblesState['data']>((accum, association) => {
        if (!association) return accum
        const [tokenId, identifier] = association as NftSourceItem
        return {
          ...accum,
          [identifier]: accum[identifier] ? [...accum[identifier], tokenId] : [tokenId],
        }
      }, state.data),
    }),
    false,
    'collectibles/fetchWalletNfts/fulfilled',
  )
}