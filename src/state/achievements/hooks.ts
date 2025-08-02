import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State, AchievementState } from '../types'
import { fetchAchievements } from '.'

export const useFetchAchievements = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}
