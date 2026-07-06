import React from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

interface HarvestActionsBaseProps {
  earnings: BigNumber
  rewardToken: Token
  rewardTokenPrice: number
  isBnbPool: boolean
  isCompoundPool: boolean
  isLoading?: boolean
  collectModalNode: React.ReactNode
}

const HarvestActionsBase: React.FC<HarvestActionsBaseProps> = ({
  earnings,
  rewardToken,
  rewardTokenPrice,
  isCompoundPool,
  isLoading = false,
  collectModalNode,
}) => {
  const { t } = useTranslation()
  const rewardTokenBalance = getBalanceNumber(earnings, rewardToken.decimals)
  const rewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(rewardTokenPrice), rewardToken.decimals)
  const hasEarnings = earnings.toNumber() > 0

  const [onPresentCollect] = useModal(collectModalNode)

  return (
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarnings ? (
              <>
                <Balance bold fontSize="20px" decimals={5} value={rewardTokenBalance} />
                {rewardTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={rewardTokenDollarBalance}
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
      <Button disabled={!hasEarnings} onClick={onPresentCollect}>
        {isCompoundPool ? t('Collect') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestActionsBase
