import { useEffect } from 'react'
import { ProfileState } from '../types'
import { fetchProfile, useProfileStore } from './store'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

export const useFetchProfile = () => {
  const { account } = useActiveWeb3React()

  useEffect(() => {
    fetchProfile(account)
  }, [account])
}

export const useProfile = () => {
  const isInitialized = useProfileStore((state) => state.isInitialized)
  const isLoading = useProfileStore((state) => state.isLoading)
  const data = useProfileStore((state) => state.data)
  const hasRegistered = useProfileStore((state) => state.hasRegistered)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

export type { ProfileState }
