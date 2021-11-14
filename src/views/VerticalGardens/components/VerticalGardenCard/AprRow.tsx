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

  const stakingTokenPriceBigNum = new BigNumber(stakingTokenPrice)
  const plantPrice = usePricePlantBusd()
  const cakePrice = usePriceCakeBusd()

  const roundingDecimals = 2
  const compoundFrequency = 0
  const performanceFee = 0

  const apyBlockCount = new BigNumber(lastRewardUpdateBlock).minus(lastRewardUpdateBlockPrevious)

  let rewardTokenApy = new BigNumber(lastRewardUpdateRewardTokenGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .multipliedBy(new BigNumber(100))
  
  if(stakingRewardToken.symbol === 'ODDZ') {
    rewardTokenApy = new BigNumber(lastRewardUpdateRewardTokenGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(cakePrice).div(new BigNumber(0.1)))
                                        .multipliedBy(new BigNumber(100))
  }
  if(stakingRewardToken.symbol === 'CHESS') {
    rewardTokenApy = new BigNumber(lastRewardUpdateRewardTokenGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(cakePrice).div(new BigNumber(0.2)))
                                        .multipliedBy(new BigNumber(100))
  }

  let plantTokenApy = new BigNumber(lastRewardUpdatePlantGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(stakingTokenPriceBigNum).div(new BigNumber(plantPrice)))
                                        .multipliedBy(new BigNumber(100))

  if(stakingToken.symbol === 'CAKE') {
    plantTokenApy = new BigNumber(lastRewardUpdatePlantGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(cakePrice).div(new BigNumber(plantPrice)))
                                        .multipliedBy(new BigNumber(100))
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
      tokenPrice={stakingRewardTokenPrice}
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
