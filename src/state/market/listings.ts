/**
 * Listings slice (market/listings) — exports both the legacy Redux reducer
 * (kept inert for `state/index.ts`'s configureStore registration) and the
 * new Zustand action surface under the legacy thunk/action names.
 *
 * Preserved pre-migration bugs:
 *  - `fetchListingsEtaAsync.fulfilled` is a no-op spread.
 *  - `fetchListingsDataAsync` is defined but never wired into extraReducers
 *    (i.e. the result is fetched but discarded).
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ListingsState } from '../types'
import fetchListingsEta from './fetchListingsEta'

const initialState: ListingsState = { data: null, listingsDataLoaded: false, userDataLoaded: false }

const _legacyFetchListingsEtaAsync = createAsyncThunk('market/fetchListings', async (listingId: number) => {
  return fetchListingsEta(listingId)
})

const listingsSlice = createSlice({
  name: 'Listings',
  initialState,
  reducers: {
    setListingsDataLoaded: (state, action) => {
      state.listingsDataLoaded = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(_legacyFetchListingsEtaAsync.fulfilled, (state) => {
      // Preserve legacy no-op spread behaviour.
      state.data = state.data ? (state.data as any[]).map((listing) => ({ ...listing })) : state.data
    })
    // Intentionally NOT wiring _legacyFetchListingsDataAsync into extraReducers —
    // preserves the pre-migration "defined but unwired" behaviour.
  },
})

export const { setListingsDataLoaded } = listingsSlice.actions

// Zustand action surface. fetchListingsDataAsync is exported but its
// result is intentionally discarded to preserve legacy behaviour.
export {
  fetchListingsEtaAsync,
  fetchListingsDataAsync,
  useListingsStore,
} from './listings.store'

export default listingsSlice.reducer