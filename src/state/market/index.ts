import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MarketState } from '../types'
import fetchMarketData from './fetchMarketData'

const initialState: MarketState = { data: null, marketDataLoaded: false}

// Async thunks
export const fetchMarketPublicAsync = createAsyncThunk(
  'market/fetchMarketData',
  async () => {
    const market = await fetchMarketData()
    return market
  },
)

export const marketSlice = createSlice({
    name: 'Market',
    initialState,
    reducers: {
        setMarketDataLoaded: (state, action) => {
          const marketDataLoaded = action.payload
          state.marketDataLoaded = marketDataLoaded
        },
    },
    extraReducers: (builder) => {
      // Update farms with live data
      builder.addCase(fetchMarketPublicAsync.fulfilled, (state) => {
        state.data = state.data.map((market) => {
          return { ...market }
        })
      })
    },
})

// Actions
export const { setMarketDataLoaded } = marketSlice.actions

export default marketSlice.reducer
