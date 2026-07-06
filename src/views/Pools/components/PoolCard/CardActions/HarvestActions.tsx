import React from 'react'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import HarvestActionsBase from 'components/HarvestActionsBase'
import CollectModal from '../Modals/CollectModal'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
}) => {
  const isCompoundPool = sousId === 0
  const rewardTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(rewardTokenBalance, 3, 3)
  const earningsDollarValue = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)

  return (
    <HarvestActionsBase
      earnings={earnings}
      rewardToken={earningToken}
      rewardTokenPrice={earningTokenPrice}
      isCompoundPool={isCompoundPool}
      isLoading={isLoading}
      collectModalNode={
        <CollectModal
          formattedBalance={formattedBalance}
          fullBalance={fullBalance}
          earningToken={earningToken}
          earningsDollarValue={earningsDollarValue}
          sousId={sousId}
          isBnbPool={isBnbPool}
          isCompoundPool={isCompoundPool}
        />
      }
    />
  )
}

export default HarvestActions
