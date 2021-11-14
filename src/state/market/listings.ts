import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ListingsState } from '../types'
import fetchListingsEta from './fetchListingsEta'
import {
  fetchMarketListingMeta, 
//  fetchMarketListingBuyData, 
  fetchMarketListingSellData,
//  fetchMarketListingStats,
//  fetchMarketItem 
} from './fetchListings'

const initialState: ListingsState = { data: null, listingsDataLoaded: false, userDataLoaded: false }

// Async thunks
export const fetchListingsEtaAsync = createAsyncThunk(
  'market/fetchListings',
  async (listingId: number) => {
    const listingsEta = await fetchListingsEta(listingId)
    return listingsEta
  },
)

interface ListingsDataResponse {
  listingId: number
  seller: string
  sellNftElseToken: boolean
  sellTokenAddress: string
  sellTokenId: number
  sellCount: number
}

export const fetchListingsDataAsync = createAsyncThunk<ListingsDataResponse, { listingId: number }>(
  'farms/fetchFarmUserDataAsync',
  async ({ listingId }) => {
    const listingMeta = await fetchMarketListingMeta(listingId)
    const listingSellData = await fetchMarketListingSellData(listingId)

      return {
        listingId,
        seller: listingMeta.seller,
        sellNftElseToken: listingSellData.sellNftElseToken,
        sellTokenAddress: listingSellData.sellTokenAddress,
        sellTokenId: listingSellData.sellTokenId,
        sellCount: listingSellData.sellCount,
      }
  },
)

export const listingsSlice = createSlice({
    name: 'Listings',
    initialState,
    reducers: {
        setListingsDataLoaded: (state, action) => {
          const listingsDataLoaded = action.payload
          state.listingsDataLoaded = listingsDataLoaded
        },
  },
  extraReducers: (builder) => {
    // Update listings with live data
    builder.addCase(fetchListingsEtaAsync.fulfilled, (state) => {
      state.data = state.data.map((listing) => {
        return { ...listing }
      })
    })
  },
})

// Actions
export const { setListingsDataLoaded } = listingsSlice.actions

export default listingsSlice.reducer
