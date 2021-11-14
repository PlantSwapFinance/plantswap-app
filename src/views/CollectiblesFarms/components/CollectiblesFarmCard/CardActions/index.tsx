import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
// import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetCollectibles } from 'state/hooks'
import { CollectiblesFarmCategory } from 'config/constants/types'
import { CollectiblesFarm } from 'state/types'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  collectiblesFarm: CollectiblesFarm
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ collectiblesFarm, stakedBalance }) => {
  const { cfId, stakingRewardToken, harvest, collectiblesFarmCategory, userData, stakingExtraRewardTokenPrice } = collectiblesFarm
  // Vertical Gardens using native BNB behave differently than pools using a token
  const isBnbPool = collectiblesFarmCategory === CollectiblesFarmCategory.BINANCE
  const { t } = useTranslation()
  
  const { nftsInWallet } = useGetCollectibles()
  const earnings = new BigNumber(0)
  // const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
                {`${stakingRewardToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={earnings}
              stakingRewardToken={stakingRewardToken}
              cfId={cfId}
              stakingExtraRewardTokenPrice={stakingExtraRewardTokenPrice}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
            />
            <Box display="inline">
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? "Nft" : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `NFT`}
          </InlineText>
        </Box>
          <StakeActions
            isLoading={isLoading}
            collectiblesFarm={collectiblesFarm}
            nftsInWallet={nftsInWallet}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
      </Flex>
    </Flex>
  )
}

export default CardActions
