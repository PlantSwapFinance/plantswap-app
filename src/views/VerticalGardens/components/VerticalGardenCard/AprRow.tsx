import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { usePricePlantBusd, usePriceCakeBusd } from 'state/farms/hooks'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { VerticalGarden } from 'state/types'
import { getAddress } from 'utils/addressHelpers'

interface AprRowProps {
  verticalGarden: VerticalGarden
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ verticalGarden }) => {
  const { t } = useTranslation()
  const { 
    stakingToken, 
    stakingRewardToken, 
    verticalEarningToken, 
    verticalGardenMasterGardenerAllocPt,
    lastRewardUpdateBlock,
    lastRewardUpdateBlockPrevious,
    lastRewardUpdateTotalStakedToken,
    lastRewardUpdateRewardTokenGained,
    stakingTokenPrice, 
    lastRewardUpdatePlantGained, 
    isFinished, 
    stakingRewardTokenPrice, 
    isAutoVault } = verticalGarden

  const tooltipContent = isAutoVault
    ? t('APY includes compounding, APR doesn’t. This pool’s PLANT is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const stakingTokenPriceBigNum = new BigNumber(stakingTokenPrice ?? 0)
  const plantPrice = usePricePlantBusd()
  const cakePrice = usePriceCakeBusd()

  const roundingDecimals = 2
  const compoundFrequency = 0
  const performanceFee = 0

  const apyBlockCount = new BigNumber(lastRewardUpdateBlock ?? 0).minus(lastRewardUpdateBlockPrevious ?? 0)
  const rewardGained = new BigNumber(lastRewardUpdateRewardTokenGained ?? 0)
  const plantGained = new BigNumber(lastRewardUpdatePlantGained ?? 0)
  const totalStaked = new BigNumber(lastRewardUpdateTotalStakedToken ?? 0)
  const canComputeApy = apyBlockCount.gt(0) && totalStaked.gt(0)

  let rewardTokenApy = new BigNumber(0)
  let plantTokenApy = new BigNumber(0)

  if (canComputeApy) {
    rewardTokenApy = rewardGained.div(apyBlockCount).multipliedBy(10512000).div(totalStaked).multipliedBy(100)

    if (stakingRewardToken.symbol === 'ODDZ') {
      rewardTokenApy = rewardGained
        .div(apyBlockCount)
        .multipliedBy(10512000)
        .div(totalStaked)
        .div(cakePrice.div(0.1))
        .multipliedBy(100)
    }
    if (stakingRewardToken.symbol === 'CHESS') {
      rewardTokenApy = rewardGained
        .div(apyBlockCount)
        .multipliedBy(10512000)
        .div(totalStaked)
        .div(cakePrice.div(0.2))
        .multipliedBy(100)
    }

    if (stakingToken.symbol === 'CAKE') {
      plantTokenApy = plantGained
        .div(apyBlockCount)
        .multipliedBy(10512000)
        .div(totalStaked)
        .div(cakePrice.div(plantPrice))
        .multipliedBy(100)
    } else if (stakingTokenPriceBigNum.gt(0)) {
      plantTokenApy = plantGained
        .div(apyBlockCount)
        .multipliedBy(10512000)
        .div(totalStaked)
        .div(stakingTokenPriceBigNum.div(plantPrice))
        .multipliedBy(100)
    }
  }

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'

  const [onPresentPlantApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={plantPrice.toNumber()}
      apr={plantTokenApy.toNumber()}
      linkLabel={t('Get %symbol%', { symbol: verticalEarningToken.symbol })}
      linkHref={apyModalLink}
      earningTokenSymbol={verticalEarningToken.symbol}
      roundingDecimals={roundingDecimals}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={stakingRewardTokenPrice ?? 0}
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
    {verticalGardenMasterGardenerAllocPt > 0 && (
      <>
      <Flex alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <TooltipText ref={targetRef}>{verticalEarningToken.symbol} {`${t('APR')}:`}</TooltipText>
        {isFinished ? (
          <Skeleton width="82px" height="32px" />
        ) : (
          <Flex alignItems="center">
            <Balance
              fontSize="16px"
              isDisabled={isFinished}
              value={plantTokenApy.toNumber()}
              decimals={2}
              unit="%"
              bold
            />
            <IconButton onClick={onPresentPlantApyModal} variant="text" scale="sm">
              <CalculateIcon color="textSubtle" width="18px" />
            </IconButton>
          </Flex>
        )}
      </Flex>
      </>
    )}
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{stakingRewardToken.symbol} {`${t('APR')}:`}</TooltipText>
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
