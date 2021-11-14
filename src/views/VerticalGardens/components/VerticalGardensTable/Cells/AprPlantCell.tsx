import React from 'react'
import styled from 'styled-components'
import { Text } from '@plantswap/uikit'
import { VerticalGarden } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import AprPlant from '../AprPlant'

interface AprCellProps {
  verticalGarden: VerticalGarden
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprPlantCell: React.FC<AprCellProps> = ({ verticalGarden }) => {
  const { t } = useTranslation()
//  const { isXs, isSm } = useMatchBreakpoints()
  const { verticalEarningToken } = verticalGarden

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
        🌱{verticalEarningToken.symbol} {t('APR')}
        </Text>
        <AprPlant verticalGarden={verticalGarden} />
      </CellContent>
    </StyledCell>
  )
}

export default AprPlantCell
