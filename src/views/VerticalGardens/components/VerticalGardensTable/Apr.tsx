import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from '@plantswap/uikit'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { VerticalGarden } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'

interface AprProps extends FlexProps {
  verticalGarden: VerticalGarden
  showIcon?: boolean
}

const Apr: React.FC<AprProps> = ({ verticalGarden, showIcon , ...props }) => {
  const { 
    stakingToken, 
    stakingRewardToken, 
    isFinished, 
    stakingRewardTokenPrice,
    lastRewardUpdateBlock,
    lastRewardUpdateBlockPrevious,
    lastRewardUpdateRewardTokenGained,
    lastRewardUpdateTotalStakedToken
   } = verticalGarden
  const { t } = useTranslation()
  const roundingDecimals = 2
  const performanceFee = 0
  const compoundFrequency = 0

  
  const apyBlockCount = new BigNumber(lastRewardUpdateBlock).minus(lastRewardUpdateBlockPrevious)

  let rewardTokenApy = new BigNumber(0)
  if(stakingRewardToken === stakingToken) {
    rewardTokenApy = new BigNumber(lastRewardUpdateRewardTokenGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .multipliedBy(new BigNumber(100))
  }
  if(stakingRewardToken.symbol === 'ODDZ') {
    rewardTokenApy = new BigNumber(lastRewardUpdateRewardTokenGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(16).div(new BigNumber(0.01)))
                                        .multipliedBy(new BigNumber(100))
  }
  if(stakingRewardToken.symbol === 'CHESS') {
    rewardTokenApy = new BigNumber(lastRewardUpdateRewardTokenGained)
                                        .div(apyBlockCount)
                                        .multipliedBy(new BigNumber(10512000))
                                        .div(lastRewardUpdateTotalStakedToken)
                                        .div(new BigNumber(16).div(new BigNumber(0.1)))
                                        .multipliedBy(new BigNumber(100))
  }
  const apyModalLink = stakingToken?.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={stakingRewardTokenPrice}
      apr={rewardTokenApy.toNumber()}
      linkLabel={t('Get %symbol%', { symbol: stakingToken?.symbol })}
      linkHref={apyModalLink}
      earningTokenSymbol={stakingRewardToken.symbol}
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
      {rewardTokenApy.toNumber() || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : rewardTokenApy.toNumber()}
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
