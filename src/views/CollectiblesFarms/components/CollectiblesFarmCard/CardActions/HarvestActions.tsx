import React from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
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
  const { t } = useTranslation()
  const stakingRewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)
  const formattedBalance = formatNumber(stakingRewardTokenBalance, 3, 3)

  const stakingRewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(stakingExtraRewardTokenPrice), stakingRewardToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings, stakingRewardToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = false

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      stakingRewardToken={stakingRewardToken}
      earningsDollarValue={stakingRewardTokenDollarBalance}
      cfId={cfId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

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
                {stakingExtraRewardTokenPrice > 0 && (
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
      <Button disabled={!hasEarnings} onClick={onPresentCollect}>
        {isCompoundPool ? t('Collect') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestActions
