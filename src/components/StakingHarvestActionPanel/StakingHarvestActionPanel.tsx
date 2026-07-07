import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, Skeleton, Text, useModal } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Token } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

// NOTE: ActionContainer / ActionTitles / ActionContent are intentionally redefined here
// (byte-identical to views/Pools/components/PoolsTable/ActionPanel/styles.ts) so this
// shared panel can be used by Pools, Vertical Gardens, and Collectibles Farms without
// crossing view boundaries. If the per-view styles ever change, update them here too.
const ActionContainer = styled.div`
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-right: 0;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }
`

const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
`

const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface StakingHarvestActionPanelProps {
  earnings: BigNumber
  earningsToken: Token
  earningsTokenPrice: number
  isCompoundPool: boolean
  userDataLoaded: boolean
  collectModalNode: React.ReactNode
  title: React.ReactNode
  hideButton?: boolean
  wrapInContainer?: boolean
}

const StakingHarvestActionPanel: React.FC<StakingHarvestActionPanelProps> = ({
  earnings,
  earningsToken,
  earningsTokenPrice,
  isCompoundPool,
  userDataLoaded,
  collectModalNode,
  title,
  hideButton = false,
  wrapInContainer = true,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const earningsTokenBalance = getBalanceNumber(earnings, earningsToken.decimals)
  const earningsTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningsTokenPrice), earningsToken.decimals)
  const hasEarnings = earnings.gt(0)

  const [onPresentCollect] = useModal(collectModalNode ?? null)

  const body = (
    <>
      <ActionTitles>{title}</ActionTitles>
      <ActionContent>
        {!account && !hideButton ? (
          <>
            <Heading>0</Heading>
            <Button disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</Button>
          </>
        ) : !userDataLoaded ? (
          <Skeleton width={180} height="32px" marginTop={14} />
        ) : (
          <>
            <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
              {hasEarnings ? (
                <>
                  <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningsTokenBalance} />
                  {earningsTokenPrice > 0 && (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      prefix="~"
                      value={earningsTokenDollarBalance}
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
            </Flex>
            {!hideButton && (
              <Button disabled={!hasEarnings} onClick={onPresentCollect}>
                {isCompoundPool ? t('Collect') : t('Harvest')}
              </Button>
            )}
          </>
        )}
      </ActionContent>
    </>
  )

  return wrapInContainer ? <ActionContainer>{body}</ActionContainer> : body
}

export default StakingHarvestActionPanel