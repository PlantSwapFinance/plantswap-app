import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new plant allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param plantPriceUsd Plant price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  plantPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
): { plantRewardsApr: number; lpRewardsApr: number } => {
  const yearlyPlantRewardAllocation = CAKE_PER_BLOCK.times(poolWeight)
  const plantRewardsApr = yearlyPlantRewardAllocation.times(plantPriceUsd).div(poolLiquidityUsd).times(100)
  let plantRewardsAprAsNumber = null
  if (!plantRewardsApr.isNaN() && plantRewardsApr.isFinite()) {
    plantRewardsAprAsNumber = plantRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { plantRewardsApr: plantRewardsAprAsNumber, lpRewardsApr }
}

export default null
