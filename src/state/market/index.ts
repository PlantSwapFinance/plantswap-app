/**
 * Market slice — exports both the legacy Redux reducer (kept inert for
 * `state/index.ts`'s configureStore registration) and the new Zustand
 * action surface under the legacy thunk/action names.
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MarketState } from '../types'
import fetchMarketData from './fetchMarketData'

const initialState: MarketState = { data: null, marketDataLoaded: false }

// Legacy thunk kept inert — never dispatched. The .fulfilled handler was
// already a no-op in the original (just spread) so even if it fires it
// doesn't change state. Preserved for `state/index.ts` reducer registration.
const _legacyFetchMarketPublicAsync = createAsyncThunk('market/fetchMarketData', async () => {
  return fetchMarketData()
})

const marketSlice = createSlice({
  name: 'Market',
  initialState,
  reducers: {
    setMarketDataLoaded: (state, action) => {
      state.marketDataLoaded = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(_legacyFetchMarketPublicAsync.fulfilled, (state) => {
      // Preserve the legacy no-op spread behaviour exactly.
      state.data = state.data ? (state.data as any[]).map((market) => ({ ...market })) : state.data
    })
  },
})

export const { setMarketDataLoaded } = marketSlice.actions

export { fetchMarketPublicData as fetchMarketPublicAsync, useMarketStore } from './store'

export default marketSlice.reducer