import BigNumber from 'bignumber.js'
import { getPlantAddress } from 'utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's CAKE balance is at least the amount passed in
 */
const useHasPlantBalance = (minimumBalance: BigNumber) => {
  const { balance: plantBalance } = useTokenBalance(getPlantAddress())
  return plantBalance.gte(minimumBalance)
}

export default useHasPlantBalance
