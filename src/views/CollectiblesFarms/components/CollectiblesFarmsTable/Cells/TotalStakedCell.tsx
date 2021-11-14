import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { CollectiblesFarm } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  collectiblesFarm: CollectiblesFarm
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ collectiblesFarm }) => {
  const { t } = useTranslation()
  const { totalStaked } = collectiblesFarm

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, 0)
  }, [totalStaked])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total collectibles staked')}
        </Text>
        {totalStakedBalance > 0 ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` Nft`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
