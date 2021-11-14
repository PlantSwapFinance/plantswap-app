import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { CollectiblesFarm } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  collectiblesFarm: CollectiblesFarm
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 12px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ collectiblesFarm }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { label, description, stakingRewardToken, userData, isFinished } = collectiblesFarm

  const stakedBalance = userData?.collectiblesBalance ? new BigNumber(userData.collectiblesBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)

  const showStakedTag = isStaked

  const earnTokenEcho = stakingRewardToken.symbol
  const title = `${t('Earn')} ${earnTokenEcho}`
  const subtitle = `${t('Stake %symbol% collectibles', { symbol: label })}`

  return (
    <StyledCell role="cell">
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
            {t('Staked')}
          </Text>
        )}
        <Text bold={!isXs && !isSm} small={isXs || isSm}>
          {title}
        </Text>
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
          {description && (
            <Text fontSize="10px" color="textSubtle">
              {description}
            </Text>
          )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
