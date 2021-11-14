import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, HelpIcon, Skeleton, FlexProps, useTooltip } from '@plantswap/uikit'
import Balance from 'components/Balance'
import { CollectiblesFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'

interface AprProps extends FlexProps {
  collectiblesFarm: CollectiblesFarm
  showIcon?: boolean
}

const Apr: React.FC<AprProps> = ({ collectiblesFarm, ...props }) => {
  const { 
    collectiblesFarmMasterGardenerAllocPt,
    lastNftStakedCount,
    isFinished, 
   } = collectiblesFarm
  const { t } = useTranslation()

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
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {rewardTokenApy.toNumber() || isFinished ? (
        <>
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : rewardTokenApy.toNumber()}
            decimals={2}
            unit="%"
          />
          <span ref={aprTargetRef}>
            <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
          </span>
          {aprTooltipVisible && aprTooltip}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </Flex>
  )
}

export default Apr
