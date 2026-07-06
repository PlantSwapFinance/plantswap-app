import { useEffect } from 'react'
import useRefresh from 'hooks/useRefresh'
import {
  fetchCollectiblesFarmsPublicData,
  fetchCollectiblesFarmsUserData,
  useCollectiblesFarmsStore,
} from './store'
import { CollectiblesFarm } from '../types'

export const useFetchPubliCollectiblesFarmsData = () => {
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    fetchCollectiblesFarmsPublicData()
  }, [slowRefresh])
}

export const useCollectiblesFarms = (
  account,
): { collectiblesFarms: CollectiblesFarm[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      fetchCollectiblesFarmsUserData(account)
    }
  }, [account, fastRefresh])

  const collectiblesFarms = useCollectiblesFarmsStore((state) => state.data)
  const userDataLoaded = useCollectiblesFarmsStore((state) => state.userDataLoaded)
  return { collectiblesFarms, userDataLoaded }
}