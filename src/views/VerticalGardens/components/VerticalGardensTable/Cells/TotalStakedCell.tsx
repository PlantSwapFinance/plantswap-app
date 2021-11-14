import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { VerticalGarden } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  verticalGarden: VerticalGarden
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ verticalGarden }) => {
  const { t } = useTranslation()
  const { stakingToken, totalStaked } = verticalGarden

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, 18)
  }, [totalStaked])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        {totalStakedBalance > 0 ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={`${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
