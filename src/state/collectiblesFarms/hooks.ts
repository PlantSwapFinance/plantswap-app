import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import {
  fetchCollectiblesFarmsPublicDataAsync,
  fetchCollectiblesFarmsUserDataAsync,
} from '.'
import { State, CollectiblesFarm } from '../types'

export const useFetchPubliCollectiblesFarmsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchCollectiblesFarmsPublicData = async () => {
      dispatch(fetchCollectiblesFarmsPublicDataAsync())
    }

    fetchCollectiblesFarmsPublicData()
  }, [dispatch, slowRefresh])
}

export const useCollectiblesFarms = (account): { collectiblesFarms: CollectiblesFarm[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchCollectiblesFarmsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { collectiblesFarms, userDataLoaded } = useSelector((state: State) => ({
    collectiblesFarms: state.collectiblesFarms.data,
    userDataLoaded: state.collectiblesFarms.userDataLoaded,
  }))
  return { collectiblesFarms, userDataLoaded }
}