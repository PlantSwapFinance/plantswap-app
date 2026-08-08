import merge from 'lodash/merge'
import teamsList from 'config/constants/teams'
import { getProfileContract } from 'utils/contractHelpers'
import { Team } from 'config/constants/types'
import { multicallv2 } from 'utils/multicall'
import { TeamsById } from 'state/types'
import profileABI from 'config/abi/plantswapGardenersProfile.json'
import { getPlantProfileAddress } from 'utils/addressHelpers'

const profileContract = getProfileContract()

const toNumber = (value: unknown): number => {
  if (value == null) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  if (typeof (value as { toNumber?: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber()
  }
  return Number(value.toString())
}

export const getTeam = async (teamId: number): Promise<Team> => {
  try {
    const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = await profileContract.getTeamProfile(teamId)
    const staticTeamInfo = teamsList.find((staticTeam) => staticTeam.id === teamId)

    return merge({}, staticTeamInfo, {
      isJoinable,
      name: teamName,
      users: toNumber(numberUsers),
      points: toNumber(numberPoints),
    })
  } catch (error) {
    return null
  }
}

/**
 * Gets on-chain data and merges it with the existing static list of teams
 */
export const getTeams = async (): Promise<TeamsById> => {
  const teamsById = teamsList.reduce((accum, team) => {
    return {
      ...accum,
      [team.id]: team,
    }
  }, {} as TeamsById)

  try {
    const nbTeams = await profileContract.numberTeams()
    const teamCount = toNumber(nbTeams)

    const calls = []
    for (let i = 1; i <= teamCount; i++) {
      calls.push({
        address: getPlantProfileAddress(),
        name: 'getTeamProfile',
        params: [i],
      })
    }
    const teamData = await multicallv2(profileABI, calls)

    const onChainTeamData = (teamData ?? []).reduce((accum, team, index) => {
      if (!team) return accum
      const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = team

      return {
        ...accum,
        [index + 1]: {
          name: teamName,
          users: toNumber(numberUsers),
          points: toNumber(numberPoints),
          isJoinable,
        },
      }
    }, {} as TeamsById)

    return merge({}, teamsById, onChainTeamData)
  } catch (error) {
    // Keep the static team list so /teams still renders when the profile contract is unreachable.
    console.error('Failed to fetch on-chain teams', error)
    return teamsById
  }
}
