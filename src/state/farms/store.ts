import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

export const initialState: FarmsState = {
  data: noAccountFarmConfig,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
}

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

export const useFarmsStore = create<FarmsState>()(
  devtools(
    () => initialState,
    { name: 'farms' },
  ),
)

export const setLoadArchivedFarmsData = (payload: boolean): void => {
  useFarmsStore.setState({ loadArchivedFarmsData: payload }, false, 'farms/setLoadArchivedFarmsData')
}

/**
 * Fetch public farm data (TVL, APY, token prices) for the given pids.
 * Mutates the Zustand store directly. Replaces the legacy
 * `fetchFarmsPublicDataAsync` thunk.
 */
export const fetchFarmsPublicData = async (pids: number[]): Promise<void> => {
  const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
  const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)

  const farmsRaw = await fetchFarms(farmsWithPriceHelpers)
  const farms = await fetchFarmsPrices(farmsRaw)
  // Filter out price helper LP config farms.
  const liveFarms = (farms as Farm[]).filter((farm) => farm.pid || farm.pid === 0)

  useFarmsStore.setState(
    (state) => ({
      data: state.data.map((farm) => {
        const liveFarmData = liveFarms.find((d) => d.pid === farm.pid)
        return liveFarmData ? { ...farm, ...liveFarmData } : farm
      }),
    }),
    false,
    'farms/fetchFarmsPublicDataAsync/fulfilled',
  )
}

export interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

/**
 * Fetch user-specific farm data (allowance, balance, staked, earnings) for
 * the given account and pids. Replaces the legacy `fetchFarmUserDataAsync`
 * thunk.
 */
export const fetchFarmUserData = async ({
  account,
  pids,
}: {
  account: string
  pids: number[]
}): Promise<void> => {
  const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
  const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
  const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
  const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

  const rows: FarmUserDataResponse[] = userFarmAllowances.map((_, index) => ({
    pid: farmsToFetch[index].pid,
    allowance: userFarmAllowances[index],
    tokenBalance: userFarmTokenBalances[index],
    stakedBalance: userStakedBalances[index],
    earnings: userFarmEarnings[index],
  }))

  useFarmsStore.setState(
    (state) => ({
      data: state.data.map((farm) => {
        const userDataEl = rows.find((r) => r.pid === farm.pid)
        return userDataEl ? { ...farm, userData: userDataEl } : farm
      }),
      userDataLoaded: true,
    }),
    false,
    'farms/fetchFarmUserDataAsync/fulfilled',
  )
}