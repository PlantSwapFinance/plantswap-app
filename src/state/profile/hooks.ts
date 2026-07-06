import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ProfileState } from '../types'
import { fetchProfile, useProfileStore } from './store'

export const useFetchProfile = () => {
  const { account } = useWeb3React()

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