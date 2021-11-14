import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, Flex, Box, useModal, useMatchBreakpoints } from '@plantswap/uikit'
import { VerticalGarden } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import CollectModal from '../../VerticalGardenCard/Modals/CollectModal'

interface EarningsCellProps {
  verticalGarden: VerticalGarden
  account: string
  userDataLoaded: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<EarningsCellProps> = ({ verticalGarden, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { vgId, stakingRewardToken, userData, stakingRewardTokenPrice, isAutoVault } = verticalGarden
  const isManualPlantPool = vgId === 0

  const earnings = userData?.estimateReward ? new BigNumber(userData.estimateReward) : BIG_ZERO
  // These will be reassigned later if its Auto PLANT vault
  const stakingRewardTokenBalance = getBalanceNumber(earnings)
  const stakingRewardTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(stakingRewardTokenPrice))
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
      vgId={vgId}
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
              <Box mr="8px" height="32px" onClick={!isAutoVault && hasEarnings ? handleEarningsClick : undefined}>
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
