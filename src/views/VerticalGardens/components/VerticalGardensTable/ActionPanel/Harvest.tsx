import React from 'react'
import { Button, Text, useModal, Flex, Skeleton, Heading } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { VerticalGardenCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { usePricePlantBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { VerticalGarden } from 'state/types'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
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
  const { address: account } = useAccount()

  const earnings = userData?.estimateReward ? new BigNumber(userData.estimateReward) : BIG_ZERO
  const earningsPlant = userData?.estimatePlantReward ? new BigNumber(userData.estimatePlantReward) : BIG_ZERO
  // These will be reassigned later if its Auto PLANT vault
  const plantPrice = usePricePlantBusd()
  const stakingRewardTokenBalance = getBalanceNumber(earnings, stakingRewardToken.decimals)
  const verticalEarningTokenBalance = getBalanceNumber(earningsPlant, verticalEarningToken.decimals)
  const stakingRewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(stakingRewardTokenPrice), stakingRewardToken.decimals)
  const verticalEarningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(plantPrice), verticalEarningToken.decimals)
  const hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, stakingRewardToken.decimals)
  const formattedBalance = formatNumber(stakingRewardTokenBalance, 3, 3)
  const isCompoundPool = vgId === 0
  const isBnbPool = verticalGardenCategory === VerticalGardenCategory.BINANCE

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      stakingRewardToken={stakingRewardToken}
      earningsDollarValue={stakingRewardTokenDollarBalance}
      vgId={vgId}
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
                {stakingRewardTokenPrice > 0 && (
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
      {verticalGardenMasterGardenerAllocPt > 0 && (
        <>
        <ActionTitles>{actionPlantTitle}</ActionTitles>
        <ActionContent>
          <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
            <>
              {hasEarnings ? (
                <>
                  <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={verticalEarningTokenBalance} />
                  {stakingRewardTokenPrice > 0 && (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      prefix="~"
                      value={verticalEarningTokenDollarBalance}
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
        </ActionContent>
        </>
      )}
    </ActionContainer>
  )
}

export default HarvestAction
