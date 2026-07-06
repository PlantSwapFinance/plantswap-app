import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Achievement } from '../types'
import { fetchAchievements, useAchievementsStore } from './store'

export const useFetchAchievements = () => {
  const { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      fetchAchievements(account)
    }
  }, [account])
}

export const useAchievements = (): Achievement[] => {
  return useAchievementsStore((state) => state.data)
}