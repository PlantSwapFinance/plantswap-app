import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import teamsList from 'config/constants/teams'
import { Team } from 'config/constants/types'
import { TeamsById, TeamsState } from '../types'
import { getTeam, getTeams } from './helpers'

const teamsById: TeamsById = teamsList.reduce((accum, team) => {
  return {
    ...accum,
    [team.id]: team,
  }
}, {})

export const initialState: TeamsState = {
  isInitialized: false,
  isLoading: true,
  data: teamsById,
}

export type TeamsAction =
  | { type: 'teams/fetchStart' }
  | { type: 'teams/fetchFailed' }
  | { type: 'teams/teamFetchSucceeded'; payload: Team }
  | { type: 'teams/teamsFetchSucceeded'; payload: TeamsById }

export const teamsReducer = (state: TeamsState, action: TeamsAction): TeamsState => {
  switch (action.type) {
    case 'teams/fetchStart':
      return { ...state, isLoading: true }
    case 'teams/fetchFailed':
      return { ...state, isLoading: false, isInitialized: true }
    case 'teams/teamFetchSucceeded':
      return {
        ...state,
        isInitialized: true,
        isLoading: false,
        data: { ...state.data, [action.payload.id]: action.payload },
      }
    case 'teams/teamsFetchSucceeded':
      return { ...state, isInitialized: true, isLoading: false, data: action.payload }
    default:
      return state
  }
}

export const useTeamsStore = create<TeamsState>()(
  devtools(
    () => initialState,
    { name: 'teams' },
  ),
)

export const fetchStart = (): void => {
  useTeamsStore.setState((state) => teamsReducer(state, { type: 'teams/fetchStart' }), false, 'teams/fetchStart')
}
export const fetchFailed = (): void => {
  useTeamsStore.setState((state) => teamsReducer(state, { type: 'teams/fetchFailed' }), false, 'teams/fetchFailed')
}
export const teamFetchSucceeded = (payload: Team): void => {
  useTeamsStore.setState(
    (state) => teamsReducer(state, { type: 'teams/teamFetchSucceeded', payload }),
    false,
    'teams/teamFetchSucceeded',
  )
}
export const teamsFetchSucceeded = (payload: TeamsById): void => {
  useTeamsStore.setState(
    (state) => teamsReducer(state, { type: 'teams/teamsFetchSucceeded', payload }),
    false,
    'teams/teamsFetchSucceeded',
  )
}

export const fetchTeam = async (teamId: number): Promise<void> => {
  try {
    fetchStart()
    const team = await getTeam(teamId)
    teamFetchSucceeded(team)
  } catch (error) {
    fetchFailed()
  }
}

export const fetchTeams = async (): Promise<void> => {
  try {
    fetchStart()
    const teams = await getTeams()
    teamsFetchSucceeded(teams)
  } catch (error) {
    fetchFailed()
  }
}