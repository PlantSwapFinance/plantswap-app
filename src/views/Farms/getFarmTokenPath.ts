import { FarmConfig } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

/**
 * In-app route where a user can get a farm's staking token:
 * the swap page for single-token farms, the add-liquidity page for LP farms.
 */
const getFarmTokenPath = ({
  isTokenOnly,
  token,
  quoteToken,
}: Pick<FarmConfig, 'isTokenOnly' | 'token' | 'quoteToken'>) => {
  if (isTokenOnly) {
    return `/swap?outputCurrency=${getAddress(token.address)}`
  }
  return `/add/${getLiquidityUrlPathParts({ quoteTokenAddress: quoteToken.address, tokenAddress: token.address })}`
}

export default getFarmTokenPath
