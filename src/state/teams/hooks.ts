import { useEffect } from 'react'
import { Team } from 'config/constants/types'
import { TeamsState } from '../types'
import { fetchTeam, fetchTeams, useTeamsStore } from './store'

export const useTeam = (id: number): Team => {
  const team = useTeamsStore((state) => state.data[id])

  useEffect(() => {
    fetchTeam(id)
  }, [id])

  return team
}

export const useTeams = (): { teams: TeamsState['data']; isInitialized: boolean; isLoading: boolean } => {
  const isInitialized = useTeamsStore((state) => state.isInitialized)
  const isLoading = useTeamsStore((state) => state.isLoading)
  const data = useTeamsStore((state) => state.data)

  useEffect(() => {
    fetchTeams()
  }, [])

  return { teams: data, isInitialized, isLoading }
}