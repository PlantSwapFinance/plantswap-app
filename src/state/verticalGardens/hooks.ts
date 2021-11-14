import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import {
  fetchVerticalGardensPublicDataAsync,
  fetchVerticalGardensUserDataAsync,
} from '.'
import { State, VerticalGarden } from '../types'

export const useFetchPubliVerticalGardensData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchVerticalGardensPublicData = async () => {
      dispatch(fetchVerticalGardensPublicDataAsync())
    }

    fetchVerticalGardensPublicData()
  }, [dispatch, slowRefresh])
}

export const useVerticalGardens = (account): { verticalGardens: VerticalGarden[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchVerticalGardensUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { verticalGardens, userDataLoaded } = useSelector((state: State) => ({
    verticalGardens: state.verticalGardens.data,
    userDataLoaded: state.verticalGardens.userDataLoaded,
  }))
  return { verticalGardens, userDataLoaded }
}
