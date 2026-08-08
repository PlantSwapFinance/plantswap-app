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

  
  const apyBlockCount = new BigNumber(lastRewardUpdateBlock ?? 0).minus(lastRewardUpdateBlockPrevious ?? 0)
  const rewardGained = new BigNumber(lastRewardUpdateRewardTokenGained ?? 0)
  const totalStaked = new BigNumber(lastRewardUpdateTotalStakedToken ?? 0)
  const canComputeApy = apyBlockCount.gt(0) && totalStaked.gt(0)

  let rewardTokenApy = new BigNumber(0)
  if (canComputeApy && stakingRewardToken === stakingToken) {
    rewardTokenApy = rewardGained.div(apyBlockCount).multipliedBy(10512000).div(totalStaked).multipliedBy(100)
  }
  if (canComputeApy && stakingRewardToken.symbol === 'ODDZ') {
    rewardTokenApy = rewardGained
      .div(apyBlockCount)
      .multipliedBy(10512000)
      .div(totalStaked)
      .div(new BigNumber(16).div(0.01))
      .multipliedBy(100)
  }
  if (canComputeApy && stakingRewardToken.symbol === 'CHESS') {
    rewardTokenApy = rewardGained
      .div(apyBlockCount)
      .multipliedBy(10512000)
      .div(totalStaked)
      .div(new BigNumber(16).div(0.1))
      .multipliedBy(100)
  }
  const apyModalLink = stakingToken?.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={stakingRewardTokenPrice ?? 0}
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
