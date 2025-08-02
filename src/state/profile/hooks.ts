import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State, ProfileState } from '../types'
import { fetchProfile } from '.'

export const useFetchProfile = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}
