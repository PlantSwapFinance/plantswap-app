import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@plantswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { VerticalGarden } from 'state/types'
import AprRow from './AprRow'
import { StyledCard, StyledCardInner } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const VerticalGardenCard: React.FC<{ verticalGarden: VerticalGarden; account: string }> = ({ verticalGarden, account }) => {
  const { stakingToken, stakingRewardToken, verticalEarningToken, verticalGardenMasterGardenerAllocPt, isFinished, userData } = verticalGarden
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    <StyledCard
      isFinished={isFinished}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardInner>
        <StyledCardHeader
          isStaking={accountHasStakedBalance}
          verticalEarningToken={verticalEarningToken}
          stakingRewardToken={stakingRewardToken}
          stakingToken={stakingToken}
          verticalGardenMasterGardenerAllocPt={verticalGardenMasterGardenerAllocPt}
          isFinished={isFinished}
        />
        <CardBody>
          <AprRow verticalGarden={verticalGarden} />
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions verticalGarden={verticalGarden} stakedBalance={stakedBalance} />
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
        <CardFooter verticalGarden={verticalGarden} account={account} />
      </StyledCardInner>
    </StyledCard>
  )
}

export default VerticalGardenCard
