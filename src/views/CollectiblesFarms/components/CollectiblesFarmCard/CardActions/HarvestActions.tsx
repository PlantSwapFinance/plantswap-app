import React from 'react'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import HarvestActionsBase from 'components/HarvestActionsBase'
import CollectModal from '../Modals/CollectModal'

interface HarvestActionsProps {
  earnings: BigNumber
  stakingRewardToken: Token
  cfId: number
  stakingExtraRewardTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  stakingRewardToken,
  cfId,
  isBnbPool,
  stakingExtraRewardTokenPrice,
  isLoading = false,
}) => {
  const rewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)
  const formattedBalance = formatNumber(rewardTokenBalance, 3, 3)
  const earningsDollarValue = getBalanceNumber(
    earnings.multipliedBy(stakingExtraRewardTokenPrice),
    stakingRewardToken.decimals,
  )
  const fullBalance = getFullDisplayBalance(earnings, stakingRewardToken.decimals)

  return (
    <HarvestActionsBase
      earnings={earnings}
      rewardToken={stakingRewardToken}
      rewardTokenPrice={stakingExtraRewardTokenPrice}
      isCompoundPool={false}
      isLoading={isLoading}
      collectModalNode={
        <CollectModal
          formattedBalance={formattedBalance}
          fullBalance={fullBalance}
          stakingRewardToken={stakingRewardToken}
          earningsDollarValue={earningsDollarValue}
          cfId={cfId}
          isBnbPool={isBnbPool}
          isCompoundPool={false}
        />
      }
    />
  )
}

export default HarvestActions
