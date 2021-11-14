import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { CollectiblesFarm } from 'state/types'

interface AprRowProps {
  collectiblesFarm: CollectiblesFarm
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ collectiblesFarm }) => {
  const { t } = useTranslation()
  const { 
    collectiblesFarmingPoolContract, 
    stakingRewardToken, 
    lastRewardBlock,
    lastReward,
    lastNftStakedCount,
    totalTokenPerBlock,
    isFinished, 
    stakingExtraRewardTokenPrice
   } = collectiblesFarm

  const roundingDecimals = 2
  const compoundFrequency = 0
  const performanceFee = 0

  const apyBlockCount = new BigNumber(lastRewardBlock).minus(lastReward)

  const rewardTokenApy = new BigNumber(totalTokenPerBlock)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastNftStakedCount)
                                        .multipliedBy(new BigNumber(100))


  const apyModalLink = collectiblesFarmingPoolContract[56] ? `/swap?outputCurrency=${collectiblesFarmingPoolContract[56]}` : '/swap'

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={stakingExtraRewardTokenPrice}
      apr={rewardTokenApy.toNumber()}
      linkLabel={t('Get %symbol%', { symbol: stakingRewardToken.symbol })}
      linkHref={apyModalLink}
      earningTokenSymbol={stakingRewardToken.symbol}
      roundingDecimals={roundingDecimals}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  return (
    <>
    <Flex alignItems="center" justifyContent="space-between">
      <TooltipText>{stakingRewardToken.symbol} {`${t('APR')}:`}</TooltipText>
      {isFinished ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <Flex alignItems="center">
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            value={rewardTokenApy.toNumber()}
            decimals={2}
            unit="%"
            bold
          />
          <IconButton onClick={onPresentApyModal} variant="text" scale="sm">
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton>
        </Flex>
      )}
    </Flex>
    </>
  )
}

export default AprRow
