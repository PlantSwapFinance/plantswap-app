import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import { PoolsState, Pool } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getAddress } from 'utils/addressHelpers'
import { fetchPoolsBlockLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser'

export const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
}

export const usePoolsStore = create<PoolsState>()(
  devtools(
    () => initialState,
    { name: 'pools' },
  ),
)

export const setPoolsPublicData = (payload: Pool[]): void => {
  usePoolsStore.setState(
    (state) => ({
      data: state.data.map((pool) => {
        const livePoolData = payload.find((entry) => entry.sousId === pool.sousId)
        return livePoolData ? { ...pool, ...livePoolData } : pool
      }),
    }),
    false,
    'pools/setPoolsPublicData',
  )
}

export const setPoolsUserData = (payload: any[]): void => {
  usePoolsStore.setState(
    (state) => ({
      data: state.data.map((pool) => {
        const userPoolData = payload.find((entry) => entry.sousId === pool.sousId)
        return userPoolData ? { ...pool, userData: userPoolData } : pool
      }),
      userDataLoaded: true,
    }),
    false,
    'pools/setPoolsUserData',
  )
}

export const updatePoolsUserData = (payload: { sousId: number; field: string; value: unknown }): void => {
  usePoolsStore.setState(
    (state) => {
      const { field, value, sousId } = payload
      const index = state.data.findIndex((p) => p.sousId === sousId)
      if (index < 0) return state
      const updated = [...state.data]
      updated[index] = {
        ...updated[index],
        userData: { ...updated[index].userData, [field]: value },
      }
      return { data: updated }
    },
    false,
    'pools/updatePoolsUserData',
  )
}

// Async thunks (Zustand-flavoured replacements for the legacy Redux thunks).

const BLOCKS_PER_YEAR = new BigNumber(10512000)
const POOL_PERFORMANCE_FEE = 0.0088

export const fetchPoolsPublicData = async (currentBlock: number): Promise<void> => {
  const [blockLimits, totalStakings] = await Promise.all([
    fetchPoolsBlockLimits(),
    fetchPoolsTotalStaking(),
  ])

  const liveData = poolsConfig.map((poolConfig) => {
    const blockLimit = blockLimits.find((entry) => entry.sousId === poolConfig.sousId)
    const totalStaking = totalStakings.find((entry) => entry.sousId === poolConfig.sousId)
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
    const isPoolFinished = poolConfig.isFinished || isPoolEndBlockExceeded

    const stakingTokenAddress = getAddress(poolConfig.stakingToken.address)
    const stakingTokenPrice = stakingTokenAddress ? new BigNumber(1) : BIG_ZERO // placeholder; full impl uses price lookup
    const totalStaked = totalStaking ? new BigNumber(totalStaking.totalStaked) : BIG_ZERO
    const apr =
      !isPoolFinished && stakingTokenPrice.gt(0) && totalStaked.gt(0)
        ? getPoolApr(
            stakingTokenPrice,
            poolConfig.tokenPerBlock,
            BLOCKS_PER_YEAR,
            totalStaked,
            POOL_PERFORMANCE_FEE,
          )
        : 0
    return {
      ...blockLimit,
      ...totalStaking,
      isFinished: isPoolFinished,
      apr,
    } as Pool
  })

  setPoolsPublicData(liveData)
}

export const fetchPoolsStakingLimits = async (): Promise<void> => {
  const stakingLimits = await fetchPoolsStakingLimits()
  setPoolsPublicData(stakingLimits as unknown as Pool[])
}

export const fetchPoolsUserData = async (account: string): Promise<void> => {
  const allowances = await fetchPoolsAllowance(account)
  const stakingTokenBalances = await fetchUserBalances(account)
  const stakedBalances = await fetchUserStakeBalances(account)
  const pendingRewards = await fetchUserPendingRewards(account)

  const userData = poolsConfig.map((pool) => ({
    sousId: pool.sousId,
    allowance: allowances[pool.sousId],
    stakingTokenBalance: stakingTokenBalances[pool.sousId],
    stakedBalance: stakedBalances[pool.sousId],
    pendingReward: pendingRewards[pool.sousId],
  }))

  setPoolsUserData(userData)
}

export const updateUserAllowance = async (sousId: number, account: string): Promise<void> => {
  const allowances = await fetchPoolsAllowance(account)
  updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] })
}

export const updateUserBalance = async (sousId: number, account: string): Promise<void> => {
  const tokenBalances = await fetchUserBalances(account)
  updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] })
}

export const updateUserStakedBalance = async (sousId: number, account: string): Promise<void> => {
  const stakedBalances = await fetchUserStakeBalances(account)
  updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] })
}

export const updateUserPendingReward = async (sousId: number, account: string): Promise<void> => {
  const pendingRewards = await fetchUserPendingRewards(account)
  updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] })
}