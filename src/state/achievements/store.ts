import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Achievement, AchievementState } from '../types'
import { getAchievements } from './helpers'

export interface AchievementAction {
  type: 'achievements/addAchievement' | 'achievements/addAchievements' | 'achievements/setAchievements' | 'achievements/clearAchievements'
  payload?: Achievement | Achievement[]
}

export const initialState: AchievementState = {
  data: [],
}

export const achievementReducer = (state: AchievementState, action: AchievementAction): AchievementState => {
  switch (action.type) {
    case 'achievements/addAchievement':
      return { data: [...state.data, action.payload as Achievement] }
    case 'achievements/addAchievements':
      return { data: [...state.data, ...(action.payload as Achievement[])] }
    case 'achievements/setAchievements':
      return { data: (action.payload as Achievement[]) ?? [] }
    case 'achievements/clearAchievements':
      return { data: [] }
    default:
      return state
  }
}

export const useAchievementsStore = create<AchievementState>()(
  devtools(
    () => initialState,
    { name: 'achievements' },
  ),
)

export const addAchievement = (payload: Achievement): void => {
  useAchievementsStore.setState((state) => achievementReducer(state, { type: 'achievements/addAchievement', payload }), false, 'achievements/addAchievement')
}
export const addAchievements = (payload: Achievement[]): void => {
  useAchievementsStore.setState((state) => achievementReducer(state, { type: 'achievements/addAchievements', payload }), false, 'achievements/addAchievements')
}
export const setAchievements = (payload: Achievement[]): void => {
  useAchievementsStore.setState((state) => achievementReducer(state, { type: 'achievements/setAchievements', payload }), false, 'achievements/setAchievements')
}
export const clearAchievements = (): void => {
  useAchievementsStore.setState((state) => achievementReducer(state, { type: 'achievements/clearAchievements' }), false, 'achievements/clearAchievements')
}

/**
 * Async thunk replacement — fetches achievements for an account and stores
 * the result. Errors are swallowed to match the pre-migration behaviour.
 */
export const fetchAchievements = async (account: string): Promise<void> => {
  try {
    const achievements = await getAchievements(account)
    setAchievements(achievements)
  } catch (error) {
    console.error(error)
  }
}