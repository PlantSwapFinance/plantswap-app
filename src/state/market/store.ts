import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { MarketState } from '../types'
import fetchMarketData from './fetchMarketData'

export const initialState: MarketState = { data: null, marketDataLoaded: false }

export const useMarketStore = create<MarketState>()(
  devtools(
    () => initialState,
    { name: 'market' },
  ),
)

export const setMarketDataLoaded = (payload: boolean): void => {
  useMarketStore.setState({ marketDataLoaded: payload }, false, 'market/setMarketDataLoaded')
}

/**
 * Fetch market data. Preserves the pre-migration behaviour exactly: the
 * `.fulfilled` handler in the legacy slice was a no-op spread (just
 * returned `state.data.map(m => ({...m}))`) that never updated state.
 * We preserve that here.
 */
export const fetchMarketPublicData = async (): Promise<void> => {
  await fetchMarketData()
  // intentionally do nothing with the response — matches legacy behaviour
}