import React from 'react'
import { Flex, Text, Heading, Skeleton } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

interface HarvestActionsProps {
  earnings: BigNumber
  stakingRewardToken: Token
  vgId: number
  stakingRewardTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestPlantActions: React.FC<HarvestActionsProps> = ({
  earnings,
  stakingRewardToken,
  stakingRewardTokenPrice,
  isLoading = false,
}) => {
  const stakingRewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)

  const stakingRewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(stakingRewardTokenPrice), stakingRewardToken.decimals)
  const hasEarnings = earnings.toNumber() > 0

  return (
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarnings ? (
              <>
                <Balance bold fontSize="20px" decimals={5} value={stakingRewardTokenBalance} />
                {stakingRewardTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={stakingRewardTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default HarvestPlantActions
