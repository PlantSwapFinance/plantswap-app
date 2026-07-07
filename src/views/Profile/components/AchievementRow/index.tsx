import React from 'react'
import styled from 'styled-components'
import { Flex } from '@plantswap/uikit'
import { Achievement } from 'state/types'
import ActionColumn from '../ActionColumn'
import PointsLabel from './PointsLabel'
import AchievementTitle from '../AchievementTitle'
import AchievementAvatar from '../AchievementAvatar'
import AchievementDescription from '../AchievementDescription'

interface AchievementRowProps {
  achievement: Achievement
  onCollectSuccess?: (achievement: Achievement) => void
}

const StyledAchievementRow = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding-bottom: 16px;
  padding-top: 16px;
`

const Details = styled.div`
  flex: 1;
`

const Body = styled(Flex)`
  flex-direction: column;
  flex: 1;
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    flex-direction: row;
  }
`

// Render-only row. The previous "Collect" button called
// `usePointCenterIfoContract().getPoints(...)` to claim IFO participation
// points; that contract wiring was removed when PlantSwap dropped the IFO
// feature, so the action is gone. The component remains so future achievement
// types that need an on-collect action can hook in without re-creating the row.
const AchievementRow: React.FC<AchievementRowProps> = ({ achievement }) => {
  return (
    <StyledAchievementRow>
      <AchievementAvatar badge={achievement.badge} />
      <Body>
        <Details>
          <AchievementTitle title={achievement.title} />
          <AchievementDescription description={achievement.description} />
        </Details>
        <PointsLabel points={achievement.points} px={[0, null, null, '32px']} mb={['16px', null, null, 0]} />
        <ActionColumn />
      </Body>
    </StyledAchievementRow>
  )
}

export default AchievementRow
