import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from '@plantswap/uikit'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { CollectiblesFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'

interface AprProps extends FlexProps {
  collectiblesFarm: CollectiblesFarm
  showIcon?: boolean
}

const Apr: React.FC<AprProps> = ({ collectiblesFarm, showIcon , ...props }) => {
  const { 
    collectiblesFarmingPoolContract, 
    stakingRewardToken, 
    isFinished, 
    stakingExtraRewardTokenPrice,
   } = collectiblesFarm
  const { t } = useTranslation()
  const roundingDecimals = 2
  const performanceFee = 0
  const compoundFrequency = 0

  const rewardTokenApy = new BigNumber(0)
  const apyModalLink = collectiblesFarmingPoolContract ? `/swap?outputCurrency=${getAddress(collectiblesFarmingPoolContract)}` : '/swap'

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={stakingExtraRewardTokenPrice}
      apr={rewardTokenApy.toNumber()}
      linkLabel={t('Get %symbol%', { symbol: "Nft" })}
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
