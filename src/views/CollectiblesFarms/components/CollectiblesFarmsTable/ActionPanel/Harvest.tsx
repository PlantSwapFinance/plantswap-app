import React from 'react'
import { Text } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { CollectiblesFarmCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
// import { getAddress } from 'utils/addressHelpers'
import StakingHarvestActionPanel from 'components/StakingHarvestActionPanel'

import { CollectiblesFarm } from 'state/types'

import CollectModal from '../../CollectiblesFarmCard/Modals/CollectModal'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'

interface HarvestActionProps extends CollectiblesFarm {
  userDataLoaded: boolean
}

const collectiblesApiUrl = process.env.REACT_APP_COLLECTIBLES_API_URL

const getOwnerToken = async (address: string, setUserToken): Promise<number[]> => {
  try {
    const response = await fetch(`${collectiblesApiUrl}/tokensByOwner/${address}`)

    if (!response.ok) {
      return []
    }
    const { data } = await response.json()
    setUserToken(data)
    return data
  } catch (error) {
    return []
  }
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  cfId,
  collectiblesFarmCategory,
  stakingRewardToken,
  totalStaked,
  // collectiblesFarmingPoolContract,
  // userData,
  userDataLoaded,
  stakingExtraRewardTokenPrice,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  // const { collectiblesList } = useCollectiblesFarmsTokenList(account, cfId, getAddress(collectiblesFarmingPoolContract), totalStaked)

  const earnings = new BigNumber(0)
  // const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const stakingRewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)
  const stakingRewardTokenDollarBalance = getBalanceNumber(
    earnings.multipliedBy(stakingExtraRewardTokenPrice),
    stakingRewardToken.decimals,
  )
  const fullBalance = getFullDisplayBalance(earnings, stakingRewardToken.decimals)
  const formattedBalance = formatNumber(stakingRewardTokenBalance, 3, 3)
  const isCompoundPool = cfId === 0
  const isBnbPool = collectiblesFarmCategory === CollectiblesFarmCategory.BINANCE

  const [userTokens, setUserToken] = React.useState<number[]>([])
  if (userTokens.length < 1) {
    getOwnerToken(account, setUserToken)
  }

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {stakingRewardToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
      <br />
      <hr />
      {1 > 0 && (
        <>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Collectibles stacked')} - {totalStaked}
          </Text>
          {/* collectiblesList.map((collectible) => (
            <>
              {cfupdateTokenDetailsTokenId(cfId, account, collectible.tokenIndex)}
              <Text fontSize="12px" bold color="textSubtle">
                {collectible.cfId}
              </Text>
              <Text fontSize="12px" bold color="textSubtle">
                {collectible.tokenIndex}
              </Text>
              <Text fontSize="12px" bold color="textSubtle">
                {collectible.tokenId}
              </Text>
              <Text fontSize="12px" bold color="textSubtle">
                {collectible.owner} %
              </Text>
            </>
          )) */}
        </>
      )}
    </>
  )

  return (
    <StakingHarvestActionPanel
      earnings={earnings}
      earningsToken={stakingRewardToken}
      earningsTokenPrice={stakingExtraRewardTokenPrice}
      isCompoundPool={isCompoundPool}
      userDataLoaded={userDataLoaded}
      collectModalNode={
        <CollectModal
          formattedBalance={formattedBalance}
          fullBalance={fullBalance}
          stakingRewardToken={stakingRewardToken}
          earningsDollarValue={stakingRewardTokenDollarBalance}
          cfId={cfId}
          isBnbPool={isBnbPool}
          isCompoundPool={isCompoundPool}
        />
      }
      title={actionTitle}
    />
  )
}

export default HarvestAction
