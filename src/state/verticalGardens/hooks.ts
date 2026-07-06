import { useEffect } from 'react'
import useRefresh from 'hooks/useRefresh'
import {
  fetchVerticalGardensPublicData,
  fetchVerticalGardensUserData,
  useVerticalGardensStore,
} from './store'
import { VerticalGarden } from '../types'

export const useFetchPubliVerticalGardensData = () => {
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    fetchVerticalGardensPublicData()
  }, [slowRefresh])
}

export const useVerticalGardens = (account): { verticalGardens: VerticalGarden[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      fetchVerticalGardensUserData(account)
    }
  }, [account, fastRefresh])

  const verticalGardens = useVerticalGardensStore((state) => state.data)
  const userDataLoaded = useVerticalGardensStore((state) => state.userDataLoaded)
  return { verticalGardens, userDataLoaded }
}