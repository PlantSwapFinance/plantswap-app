import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@plantswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { CollectiblesFarm } from 'state/types'
import AprRow from './AprRow'
import { StyledCard, StyledCardInner } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const CollectiblesFarmCard: React.FC<{ collectiblesFarm: CollectiblesFarm; account: string }> = ({ collectiblesFarm, account }) => {
  const { label, description, labelSvg, collectiblesFarmingPoolContract, stakingRewardToken, collectiblesFarmMasterGardenerAllocPt, isFinished, userData } = collectiblesFarm
  const { t } = useTranslation()
  const stakedBalance = userData?.collectiblesBalance ? new BigNumber(userData.collectiblesBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    <StyledCard
      isFinished={isFinished}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardInner>
        <StyledCardHeader
          label={label}
          description={description}
          labelSvg={labelSvg}
          isStaking={accountHasStakedBalance}
          stakingRewardToken={stakingRewardToken}
          collectiblesFarmingPoolContract={collectiblesFarmingPoolContract}
          collectiblesFarmMasterGardenerAllocPt={collectiblesFarmMasterGardenerAllocPt}
          isFinished={isFinished}
        />
        <CardBody>
          <AprRow collectiblesFarm={collectiblesFarm} />
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions collectiblesFarm={collectiblesFarm} stakedBalance={stakedBalance} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <ConnectWalletButton />
              </>
            )}
          </Flex>
        </CardBody>
        <CardFooter collectiblesFarm={collectiblesFarm} account={account} />
      </StyledCardInner>
    </StyledCard>
  )
}

export default CollectiblesFarmCard
