const collectiblesApiUrl = process.env.REACT_APP_COLLECTIBLES_API_URL

export const getOwnerToken = async (address: string): Promise<number[]> => {
    try {
      const response = await fetch(`${collectiblesApiUrl}/tokensByOwner/${address}`)

      if (!response.ok) {
        return []
      }

      const { data  = [] } = await response.json()

      return data
    } catch (error) {
      return []
    }
}

export { transformUserData, transformPool, getTokenPricesFromFarm } from '../staking/helpers'
