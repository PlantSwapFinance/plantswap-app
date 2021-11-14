import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import verticalGardensReducer from './verticalGardens'
import collectiblesFarmsReducer from './collectiblesFarms'
import poolsReducer from './pools'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'
import tasksReducer from './tasks'
import blockReducer from './block'
import collectiblesReducer from './collectibles'
import marketReducer from './market'
import listingsReducer from './market/listings'
import votingReducer from './voting'
import barnPancakeswapFarmsReducer from './barns/pancakeswap/farms'
import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'nftLists']

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    achievements: achievementsReducer,
    tasks: tasksReducer,
    block: blockReducer,
    farms: farmsReducer,
    verticalGardens: verticalGardensReducer,
    collectiblesFarms: collectiblesFarmsReducer,
    pools: poolsReducer,
    profile: profileReducer,
    teams: teamsReducer,
    collectibles: collectiblesReducer,
    market: marketReducer,
    listings: listingsReducer,
    voting: votingReducer,
    foundationVoting: votingReducer,
    barnPancakeswapFarms: barnPancakeswapFarmsReducer,

    // Exchange
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
  },
  middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store
