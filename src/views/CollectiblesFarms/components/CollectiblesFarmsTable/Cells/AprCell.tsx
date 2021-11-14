import React from 'react'
import styled from 'styled-components'
import { Text } from '@plantswap/uikit'
import { CollectiblesFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'

interface AprCellProps {
  collectiblesFarm: CollectiblesFarm
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprCell: React.FC<AprCellProps> = ({ collectiblesFarm }) => {
  const { t } = useTranslation()
//  const { isXs, isSm } = useMatchBreakpoints()
  const { stakingRewardToken } = collectiblesFarm
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {stakingRewardToken.symbol} {t('APR')}
        </Text>
        <Apr collectiblesFarm={collectiblesFarm} />
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
