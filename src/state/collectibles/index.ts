/**
 * Collectibles slice — exports both the legacy Redux reducer (kept inert
 * for `state/index.ts`'s configureStore registration) and the new
 * Zustand `fetchWalletNfts` action under the legacy thunk name.
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CollectiblesState } from 'state/types'
import { nftSources } from 'config/constants/nfts'
import { NftType } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { getNftByTokenId } from 'utils/collectibles'
import { ethers } from 'ethers'

const initialState: CollectiblesState = {
  isInitialized: false,
  isLoading: true,
  data: {},
}

type NftSourceItem = [number, string]

// Legacy thunk kept inert — never dispatched. Kept so the slice's
// extraReducers don't complain if the reducer is registered.
const _legacyFetchWalletNfts = createAsyncThunk<NftSourceItem[], string>(
  'collectibles/fetchWalletNfts',
  async (account) => {
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
      if (balanceOf === 0) return []

      const nftDataFetchPromises = []
      for (let i = 0; i < balanceOf; i++) {
        nftDataFetchPromises.push(getTokenIdAndData(i))
      }
      const nftData = await Promise.all(nftDataFetchPromises)
      return nftData
    })
    const nftSourceData = await Promise.all(nftSourcePromises)
    return nftSourceData.flat()
  },
)

const collectiblesSlice = createSlice({
  name: 'collectibles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(_legacyFetchWalletNfts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(_legacyFetchWalletNfts.fulfilled, (state, action) => {
      state.isLoading = false
      state.isInitialized = true
      state.data = action.payload.reduce((accum, association) => {
        if (!association) return accum
        const [tokenId, identifier] = association as NftSourceItem
        return {
          ...accum,
          [identifier]: accum[identifier] ? [...accum[identifier], tokenId] : [tokenId],
        }
      }, {})
    })
  },
})

export { fetchWalletNfts, useCollectiblesStore } from './store'

export default collectiblesSlice.reducer