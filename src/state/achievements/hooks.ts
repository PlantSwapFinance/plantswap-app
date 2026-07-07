import { useEffect } from 'react'
import { Achievement } from '../types'
import { fetchAchievements, useAchievementsStore } from './store'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

export const useFetchAchievements = () => {
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account) {
      fetchAchievements(account)
    }
  }, [account])
}

export const useAchievements = (): Achievement[] => {
  return useAchievementsStore((state) => state.data)
}
