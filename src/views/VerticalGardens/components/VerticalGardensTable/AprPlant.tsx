import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from '@plantswap/uikit'
import { usePricePlantBusd, usePriceCakeBusd } from 'state/farms/hooks'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { VerticalGarden } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'

interface AprProps extends FlexProps {
  verticalGarden: VerticalGarden
  showIcon?: boolean
}

const Apr: React.FC<AprProps> = ({ verticalGarden, showIcon = true, ...props }) => {
  const { 
    stakingToken,
    verticalEarningToken, 
    verticalGardenMasterGardenerAllocPt,
    isFinished, 
    lastRewardUpdateBlock,
    lastRewardUpdateBlockPrevious,
    lastRewardUpdatePlantGained, 
    lastRewardUpdateTotalStakedToken,
    stakingTokenPrice,
   } = verticalGarden
  const { t } = useTranslation()
  const roundingDecimals = 2
  const performanceFee = 0
  const compoundFrequency = 0

  const apyModalLink = verticalEarningToken?.address ? `/swap?outputCurrency=${getAddress(verticalEarningToken.address)}` : '/swap'

  const apyBlockCount = new BigNumber(lastRewardUpdateBlock).minus(lastRewardUpdateBlockPrevious)

  const stakingTokenPriceBigNum = new BigNumber(stakingTokenPrice)
  const plantPrice = usePricePlantBusd()
  const cakePrice = usePriceCakeBusd()

  let plantTokenApy = new BigNumber(0)
  if(stakingToken.symbol === 'CAKE') {
    plantTokenApy = new BigNumber(lastRewardUpdatePlantGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(cakePrice).div(new BigNumber(plantPrice)))
                                        .multipliedBy(new BigNumber(100))
  }
  if(stakingToken.symbol !== 'CAKE' && stakingTokenPrice !== undefined) {
    plantTokenApy = new BigNumber(lastRewardUpdatePlantGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(stakingTokenPriceBigNum).div(new BigNumber(plantPrice)))
                                        .multipliedBy(new BigNumber(100))
  }

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={plantPrice.toNumber()}
      apr={plantTokenApy.toNumber()}
      linkLabel={t('Get %symbol%', { symbol: verticalEarningToken?.symbol })}
      linkHref={apyModalLink}
      earningTokenSymbol={verticalEarningToken.symbol}
      roundingDecimals={roundingDecimals}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {verticalGardenMasterGardenerAllocPt > 0 || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : plantTokenApy.toNumber()}
            decimals={2}
            unit="%"
          />
          {!isFinished && showIcon && (
            <Button onClick={openRoiModal} variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
              <CalculateIcon color="textSubtle" width="20px" />
            </Button>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </Flex>
  )
}

export default Apr
