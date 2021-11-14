import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, Flex, Box, useModal, useMatchBreakpoints } from '@plantswap/uikit'
import { CollectiblesFarm } from 'state/types'
import BigNumber from 'bignumber.js'
// import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import CollectModal from '../../CollectiblesFarmCard/Modals/CollectModal'

interface EarningsCellProps {
  collectiblesFarm: CollectiblesFarm
  account: string
  userDataLoaded: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<EarningsCellProps> = ({ collectiblesFarm, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { cfId, stakingRewardToken, 
    // userData, 
    stakingExtraRewardTokenPrice } = collectiblesFarm
  const isManualPlantPool = cfId === 0

  const earnings = new BigNumber(0)
  // const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  // These will be reassigned later if its Auto PLANT vault
  const stakingRewardTokenBalance = getBalanceNumber(earnings)
  const stakingRewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(stakingExtraRewardTokenPrice))
  const hasEarnings = account && earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings)
  const formattedBalance = formatNumber(stakingRewardTokenBalance, 3, 3)

  const labelText = t('%symbol% Earned', { symbol: stakingRewardToken.symbol })
  const isBnbPool = false

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      stakingRewardToken={stakingRewardToken}
      earningsDollarValue={stakingRewardTokenDollarBalance}
      cfId={cfId}
      isBnbPool={isBnbPool}
      isCompoundPool={isManualPlantPool}
    />,
  )

  const handleEarningsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentCollect()
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {!userDataLoaded && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box mr="8px" height="32px" onClick={hasEarnings ? handleEarningsClick : undefined}>
                <Balance
                  mt="4px"
                  bold={!isXs && !isSm}
                  fontSize={isXs || isSm ? '14px' : '16px'}
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? stakingRewardTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
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
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
