import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { VerticalGarden } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage, TokenTrippleImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  verticalGarden: VerticalGarden
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ verticalGarden }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { stakingToken, stakingRewardToken, verticalEarningToken, userData, verticalGardenMasterGardenerAllocPt, isFinished } = verticalGarden

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)

  const showStakedTag = isStaked

  let earnTokenEcho = stakingRewardToken.symbol
  if(verticalGardenMasterGardenerAllocPt > 0) {
    earnTokenEcho = `🌱${verticalEarningToken.symbol} + ${stakingRewardToken.symbol}`
  }
  const title = `${t('Earn')} ${earnTokenEcho}`
  const subtitle = `${t('Stake')} ${stakingToken.symbol}`

  return (
    <StyledCell role="cell">
    {verticalGardenMasterGardenerAllocPt > 0 ? (
      <TokenTrippleImage primaryToken={stakingToken} secondaryToken={stakingRewardToken} thirdToken={verticalEarningToken} width={48} height={48} />
    ) : (
      <TokenPairImage primaryToken={stakingToken} secondaryToken={stakingRewardToken} width={48} height={48} />
    )}
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
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
