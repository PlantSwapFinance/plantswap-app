import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import farmsConfig from 'config/constants/barns/pancakeswap/farms'
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
import { BarnPancakeswapFarmsState, BarnPancakeswapFarm } from '../../../types'

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

export const initialState: BarnPancakeswapFarmsState = {
  data: noAccountFarmConfig,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
}

export const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

export const useBarnPancakeswapFarmsStore = create<BarnPancakeswapFarmsState>()(
  devtools(
    () => initialState,
    { name: 'barnPancakeswapFarms' },
  ),
)

export const setLoadArchivedFarmsData = (payload: boolean): void => {
  useBarnPancakeswapFarmsStore.setState(
    { loadArchivedFarmsData: payload },
    false,
    'barnPancakeswapFarms/setLoadArchivedFarmsData',
  )
}

/**
 * NOTE: shares the `'farms/fetchFarmsPublicDataAsync'` action type string
 * with `state/farms/`. Preserved from the pre-migration cross-listening
 * bug; will be cleaned up separately.
 */
export const fetchFarmsPublicData = async (pids: number[]): Promise<void> => {
  const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
  const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)
  const farmsRaw = await fetchFarms(farmsWithPriceHelpers)
  const farms = await fetchFarmsPrices(farmsRaw)
  const liveFarms = (farms as BarnPancakeswapFarm[]).filter((farm) => farm.pid || farm.pid === 0)

  useBarnPancakeswapFarmsStore.setState(
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

  useBarnPancakeswapFarmsStore.setState(
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