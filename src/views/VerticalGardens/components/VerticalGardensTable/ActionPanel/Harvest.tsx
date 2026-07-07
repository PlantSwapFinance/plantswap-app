import React from 'react'
import { Text } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { VerticalGardenCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { usePricePlantBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import StakingHarvestActionPanel from 'components/StakingHarvestActionPanel'
import { VerticalGarden } from 'state/types'

import { ActionContainer } from './styles'
import CollectModal from '../../VerticalGardenCard/Modals/CollectModal'

interface HarvestActionProps extends VerticalGarden {
  userDataLoaded: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  vgId,
  verticalGardenCategory,
  stakingRewardToken,
  verticalEarningToken,
  userData,
  userDataLoaded,
  verticalGardenMasterGardenerAllocPt,
  stakingRewardTokenPrice,
}) => {
  const { t } = useTranslation()
  const plantPrice = usePricePlantBusd()

  const earnings = userData?.estimateReward ? new BigNumber(userData.estimateReward) : BIG_ZERO
  const earningsPlant = userData?.estimatePlantReward ? new BigNumber(userData.estimatePlantReward) : BIG_ZERO

  const stakingRewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)
  const stakingRewardTokenDollarBalance = getBalanceNumber(
    earnings.multipliedBy(stakingRewardTokenPrice),
    stakingRewardToken.decimals,
  )
  const fullBalance = getFullDisplayBalance(earnings, stakingRewardToken.decimals)
  const formattedBalance = formatNumber(stakingRewardTokenBalance, 3, 3)
  const isCompoundPool = vgId === 0
  const isBnbPool = verticalGardenCategory === VerticalGardenCategory.BINANCE

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {stakingRewardToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )
  const actionPlantTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {verticalEarningToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  return (
    <ActionContainer>
      <StakingHarvestActionPanel
        wrapInContainer={false}
        earnings={earnings}
        earningsToken={stakingRewardToken}
        earningsTokenPrice={stakingRewardTokenPrice}
        isCompoundPool={isCompoundPool}
        userDataLoaded={userDataLoaded}
        collectModalNode={
          <CollectModal
            formattedBalance={formattedBalance}
            fullBalance={fullBalance}
            stakingRewardToken={stakingRewardToken}
            earningsDollarValue={stakingRewardTokenDollarBalance}
            vgId={vgId}
            isBnbPool={isBnbPool}
            isCompoundPool={isCompoundPool}
          />
        }
        title={actionTitle}
      />
      {verticalGardenMasterGardenerAllocPt > 0 && (
        <StakingHarvestActionPanel
          wrapInContainer={false}
          hideButton
          earnings={earningsPlant}
          earningsToken={verticalEarningToken}
          earningsTokenPrice={plantPrice}
          isCompoundPool={false}
          userDataLoaded={userDataLoaded}
          collectModalNode={null}
          title={actionPlantTitle}
        />
      )}
    </ActionContainer>
  )
}

export default HarvestAction