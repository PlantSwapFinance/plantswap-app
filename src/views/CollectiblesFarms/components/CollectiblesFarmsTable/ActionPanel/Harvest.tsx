import React from 'react'
import { Button, Text, useModal, Flex, Skeleton, Heading } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { CollectiblesFarmCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
// import { getAddress } from 'utils/addressHelpers'
import Balance from 'components/Balance'

import { CollectiblesFarm } from 'state/types'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import CollectModal from '../../CollectiblesFarmCard/Modals/CollectModal'

interface HarvestActionProps extends CollectiblesFarm {
  userDataLoaded: boolean
}

const getOwnerToken = async (address: string, setUserToken): Promise<number[]> => {
  try {
    const response = await fetch(`http://localhost:3003/tokensByOwner/${address}`)

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
  const { account } = useWeb3React()
  // const { collectiblesList } = useCollectiblesFarmsTokenList(account, cfId, getAddress(collectiblesFarmingPoolContract), totalStaked)


  const earnings = new BigNumber(0)
  // const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  // These will be reassigned later if its Auto PLANT vault
  const stakingRewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)
  const stakingRewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(stakingExtraRewardTokenPrice), stakingRewardToken.decimals)
  const hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, stakingRewardToken.decimals)
  const formattedBalance = formatNumber(stakingRewardTokenBalance, 3, 3)
  const isCompoundPool = cfId === 0
  const isBnbPool = collectiblesFarmCategory === CollectiblesFarmCategory.BINANCE

  const [userTokens, setUserToken] = React.useState<number[]>([])
  if(userTokens.length < 1) {
  getOwnerToken(account, setUserToken) }

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      stakingRewardToken={stakingRewardToken}
      earningsDollarValue={stakingRewardTokenDollarBalance}
      cfId={cfId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {stakingRewardToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
      <br />
      <br />
      {userTokens ? (
        <>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {userTokens.length} {t('Owned Tokens')} 
            {userTokens.map((token) => (
              <>
              <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                {token}
              </Text>
              </>
            ))}
          </Text>
        </>
      ) : (
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('No Owned Tokens')}
          <br />
        </Text>
      )}
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

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
          <Button disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={stakingRewardTokenBalance} />
                {stakingExtraRewardTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={stakingRewardTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
        <Button disabled={!hasEarnings} onClick={onPresentCollect}>
          {isCompoundPool ? t('Collect') : t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
