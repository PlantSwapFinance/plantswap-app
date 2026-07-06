import { useEffect } from 'react'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from 'hooks/useRefresh'
import {
  fetchPoolsPublicData,
  fetchPoolsStakingLimits,
  fetchPoolsUserData,
  usePoolsStore,
} from './store'
import { Pool } from '../types'
import { transformPool } from '../staking/helpers'

export const useFetchPublicPoolsData = () => {
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchData = async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      await fetchPoolsPublicData(blockNumber)
    }
    fetchData()
    fetchPoolsStakingLimits()
  }, [slowRefresh])
}

export const usePools = (account): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      fetchPoolsUserData(account)
    }
  }, [account, fastRefresh])

  const pools = usePoolsStore((state) => state.data)
  const userDataLoaded = usePoolsStore((state) => state.userDataLoaded)
  return { pools: pools.map(transformPool), userDataLoaded }
}