import { FarmConfig } from 'config/constants/types'
import fetchFarm from './fetchFarm'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const results = await Promise.allSettled(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      return farm
    }),
  )

  return results.flatMap((result, index) => {
    if (result.status === 'fulfilled') {
      return [result.value]
    }
    console.error(`Failed to fetch farm pid=${farmsToFetch[index]?.pid}`, result.reason)
    return []
  })
}

export default fetchFarms
