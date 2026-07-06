import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ListingsState } from '../types'
import fetchListingsEta from './fetchListingsEta'
import {
  fetchMarketListingMeta,
  fetchMarketListingSellData,
} from './fetchListings'

export const initialState: ListingsState = { data: null, listingsDataLoaded: false, userDataLoaded: false }

export const useListingsStore = create<ListingsState>()(
  devtools(
    () => initialState,
    { name: 'listings' },
  ),
)

/**
 * Preserves the legacy no-op fulfilled behaviour exactly — calls
 * `fetchListingsEta` but doesn't update state with the result.
 */
export const fetchListingsEtaAsync = async (listingId: number): Promise<void> => {
  await fetchListingsEta(listingId)
}

export interface ListingsDataResponse {
  listingId: number
  seller: string
  sellNftElseToken: boolean
  sellTokenAddress: string
  sellTokenId: number
  sellCount: number
}

/**
 * Defined but intentionally unwired into store state — preserves the
 * pre-migration "fetch but discard" behaviour of `fetchListingsDataAsync`.
 */
export const fetchListingsDataAsync = async ({ listingId }: { listingId: number }): Promise<void> => {
  await fetchMarketListingMeta(listingId)
  await fetchMarketListingSellData(listingId)
}