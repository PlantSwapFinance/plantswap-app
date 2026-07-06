import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import collectiblesFarmsConfig from 'config/constants/collectiblesFarms'
import { CollectiblesFarmsState } from 'state/types'
import { fetchCollectiblesFarmTotalStaked } from './fetchCollectiblesFarms'
import {
  fetchCollectiblesFarmsRewardTokenAllowance,
  fetchCollectiblesFarmsIsApprovedForAll,
  fetchUserCollectiblesBalance,
  fetchUserCollectiblesUses,
  fetchUserBalances,
  fetchUserRewardsHarvested,
  fetchUserExtraRewardsHarvested,
} from './fetchCollectiblesFarmsUser'

export const initialState: CollectiblesFarmsState = {
  data: [...collectiblesFarmsConfig],
  userDataLoaded: false,
}

export const useCollectiblesFarmsStore = create<CollectiblesFarmsState>()(
  devtools(
    () => initialState,
    { name: 'collectiblesFarms' },
  ),
)

export const setCollectiblesFarmsPublicData = (payload: any[]): void => {
  useCollectiblesFarmsStore.setState(
    (state) => ({
      data: state.data.map((cf) => {
        const liveData = payload.find((entry) => entry.cfId === cf.cfId)
        return liveData ? { ...cf, ...liveData } : cf
      }),
    }),
    false,
    'collectiblesFarms/setCollectiblesFarmsPublicData',
  )
}

export const setCollectiblesFarmsUserData = (payload: any[]): void => {
  useCollectiblesFarmsStore.setState(
    (state) => ({
      data: state.data.map((cf) => {
        const userData = payload.find((entry) => entry.cfId === cf.cfId)
        return userData ? { ...cf, userData } : cf
      }),
      userDataLoaded: true,
    }),
    false,
    'collectiblesFarms/setCollectiblesFarmsUserData',
  )
}

export const updateCollectiblesFarmsUserData = (payload: { cfId: string; field: string; value: unknown }): void => {
  useCollectiblesFarmsStore.setState(
    (state) => {
      const { field, value, cfId } = payload
      const index = state.data.findIndex((cf) => cf.cfId === cfId)
      if (index < 0) return state
      const updated = [...state.data]
      updated[index] = {
        ...updated[index],
        userData: { ...updated[index].userData, [field]: value },
      }
      return { data: updated }
    },
    false,
    'collectiblesFarms/updateCollectiblesFarmsUserData',
  )
}

export const fetchCollectiblesFarmsPublicData = async (): Promise<void> => {
  const totalStakeds = await fetchCollectiblesFarmTotalStaked()
  const liveData = collectiblesFarmsConfig.map((cf) => {
    const totalStaked = totalStakeds.find((entry) => entry.cfId === cf.cfId)
    return { ...totalStaked, isFinished: cf.isFinished }
  })
  setCollectiblesFarmsPublicData(liveData)
}

export const fetchCollectiblesFarmsUserData = async (account: string): Promise<void> => {
  const allowancesRewardTokens = await fetchCollectiblesFarmsRewardTokenAllowance(account)
  const isApprovedForAlls = await fetchCollectiblesFarmsIsApprovedForAll(account)
  const collectiblesBalances = await fetchUserCollectiblesBalance(account)
  const collectiblesUses = await fetchUserCollectiblesUses(account)
  const nftBalances = await fetchUserBalances(account)
  const rewardsHarvestedss = await fetchUserRewardsHarvested(account)
  const extraRewardsHarvesteds = await fetchUserExtraRewardsHarvested(account)

  const userData = collectiblesFarmsConfig.map((cf) => ({
    cfId: cf.cfId,
    allowancesRewardToken: allowancesRewardTokens[cf.cfId],
    isApprovedForAll: isApprovedForAlls[cf.cfId],
    collectiblesBalance: collectiblesBalances[cf.cfId],
    collectiblesUse: collectiblesUses[cf.cfId],
    nftBalance: nftBalances[cf.cfId],
    rewardsHarvesteds: rewardsHarvestedss[cf.cfId],
    extraRewardsHarvested: extraRewardsHarvesteds[cf.cfId],
  }))
  setCollectiblesFarmsUserData(userData)
}

export const cfupdateUserRewardTokenAllowance = async (cfId: string, account: string): Promise<void> => {
  const allowancesRewardTokens = await fetchCollectiblesFarmsRewardTokenAllowance(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'allowancesRewardToken', value: allowancesRewardTokens[cfId] })
}

export const cfupdateUserIsApprovedForAl = async (cfId: string, account: string): Promise<void> => {
  const isApprovedForAlls = await fetchCollectiblesFarmsIsApprovedForAll(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'isApprovedForAll', value: isApprovedForAlls[cfId] })
}

export const cfupdateUserCollectiblesBalance = async (cfId: string, account: string): Promise<void> => {
  const collectiblesBalances = await fetchUserCollectiblesBalance(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'collectiblesBalance', value: collectiblesBalances[cfId] })
}

export const cfupdateUserCollectiblesUse = async (cfId: string, account: string): Promise<void> => {
  const collectiblesUses = await fetchUserCollectiblesUses(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'collectiblesUse', value: collectiblesUses[cfId] })
}

export const cfupdateUserBalances = async (cfId: string, account: string): Promise<void> => {
  const nftBalances = await fetchUserBalances(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'nftBalance', value: nftBalances[cfId] })
}

export const cfupdateUserRewardsHarvested = async (cfId: string, account: string): Promise<void> => {
  const rewardsHarvestedss = await fetchUserRewardsHarvested(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'rewardsHarvesteds', value: rewardsHarvestedss[cfId] })
}

export const cfupdateUserExtraRewardsHarvested = async (cfId: string, account: string): Promise<void> => {
  const extraRewardsHarvesteds = await fetchUserExtraRewardsHarvested(account)
  updateCollectiblesFarmsUserData({ cfId, field: 'extraRewardsHarvested', value: extraRewardsHarvesteds[cfId] })
}