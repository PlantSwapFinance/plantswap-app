import React from 'react'
import { Text } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import StakingHarvestActionPanel from 'components/StakingHarvestActionPanel'
import { Pool } from 'state/types'

import CollectModal from '../../PoolCard/Modals/CollectModal'

interface HarvestActionProps extends Pool {
  userDataLoaded: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  poolCategory,
  earningToken,
  userData,
  userDataLoaded,
  isAutoVault,
  earningTokenPrice,
}) => {
  const { t } = useTranslation()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(
    earnings.multipliedBy(earningTokenPrice),
    earningToken.decimals,
  )
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const isCompoundPool = sousId === 0
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  const actionTitle = isAutoVault ? (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent PLANT profit')}
    </Text>
  ) : (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {earningToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  return (
    <StakingHarvestActionPanel
      earnings={earnings}
      earningsToken={earningToken}
      earningsTokenPrice={earningTokenPrice}
      isCompoundPool={isCompoundPool}
      userDataLoaded={userDataLoaded}
      collectModalNode={
        <CollectModal
          formattedBalance={formattedBalance}
          fullBalance={fullBalance}
          earningToken={earningToken}
          earningsDollarValue={earningTokenDollarBalance}
          sousId={sousId}
          isBnbPool={isBnbPool}
          isCompoundPool={isCompoundPool}
        />
      }
      title={actionTitle}
    />
  )
}

export default HarvestAction