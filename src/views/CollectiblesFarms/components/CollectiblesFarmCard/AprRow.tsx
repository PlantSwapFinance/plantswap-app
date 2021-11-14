import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, TooltipText, HelpIcon, useTooltip, Skeleton } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { CollectiblesFarm } from 'state/types'

interface AprRowProps {
  collectiblesFarm: CollectiblesFarm
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ collectiblesFarm }) => {
  const { t } = useTranslation()
  const { 
    stakingRewardToken, 
    lastNftStakedCount,
    collectiblesFarmMasterGardenerAllocPt,
    isFinished, 
   } = collectiblesFarm

  let rewardTokenApy = new BigNumber(collectiblesFarmMasterGardenerAllocPt).dividedBy(new BigNumber(2000)).multipliedBy(new BigNumber(10512000)).dividedBy(1).dividedBy(new BigNumber(100))
  if (lastNftStakedCount && lastNftStakedCount.toNumber() > 1) {
    rewardTokenApy = new BigNumber(collectiblesFarmMasterGardenerAllocPt).dividedBy(new BigNumber(2000)).multipliedBy(new BigNumber(10512000)).dividedBy(lastNftStakedCount).dividedBy(new BigNumber(100))
  }

  const {
    targetRef: aprTargetRef,
    tooltip: aprTooltip,
    tooltipVisible: aprTooltipVisible,
  } = useTooltip(<div>{t('The PLANT reward APR is calculated this way')}
  <br />
  <br />{t('(poolAllocationPoints)')}
  <br />&nbsp;&nbsp;&nbsp;{t('.dividedBy(totalAllocationPoints)')}
  <br />&nbsp;&nbsp;&nbsp;{t('.dividedBy(totalNFTinPool)')}
  <br />&nbsp;&nbsp;&nbsp;{t('.multipliedBy(1 year)')}
</div>, {
    placement: 'bottom',
  })

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
          <span ref={aprTargetRef}>
            <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
          </span>
          {aprTooltipVisible && aprTooltip}
        </Flex>
      )}
    </Flex>
    </>
  )
}

export default AprRow
