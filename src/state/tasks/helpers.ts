import { request, gql } from 'graphql-request'
import { campaignMap } from 'config/constants/campaigns'
import { GRAPH_API_PROFILE } from 'config/constants/endpoints'
import { Task } from 'state/types'
import { getTaskTitle, getTaskDescription } from 'utils/tasks'

interface UserPointIncreaseEvent {
  campaignId: string
  id: string // wallet address
  points: string
}

/**
 * Gets all user point increase events on the profile filtered by wallet address
 */
export const getUserPointIncreaseEvents = async (account: string): Promise<UserPointIncreaseEvent[]> => {
  try {
    const { user } = await request(
      GRAPH_API_PROFILE,
      gql`
        query getUserPointIncreaseEvents($account: ID!) {
          user(id: $account) {
            points {
              id
              campaignId
              points
            }
          }
        }
      `,
      {
        account: account.toLowerCase(),
      },
    )

    return user.points
  } catch (error) {
    return null
  }
}

/**
 * Gets all user point increase events and adds task meta
 */
export const getTasks = async (account: string): Promise<Task[]> => {
  const pointIncreaseEvents = await getUserPointIncreaseEvents(account)

  if (!pointIncreaseEvents) {
    return []
  }

  return pointIncreaseEvents.reduce((accum, userPoint) => {
    if (!campaignMap.has(userPoint.campaignId)) {
      return accum
    }

    const campaignMeta = campaignMap.get(userPoint.campaignId)

    return [
      ...accum,
      {
        id: userPoint.campaignId,
        type: campaignMeta.type,
        address: userPoint.id,
        title: getTaskTitle(campaignMeta),
        description: getTaskDescription(campaignMeta),
        badge: campaignMeta.badge,
        points: Number(userPoint.points),
      },
    ]
  }, [])
}
