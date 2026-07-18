import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, CommunityIcon, Heading, Text } from '@plantswap/uikit'
import { Team } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import StatBox from 'views/Profile/components/StatBox'

interface TeamCardProps {
  team: Team
}

const Wrapper = styled.div`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 24px;
  }
`

const Avatar = styled.img`
  border-radius: 50%;
  height: 64px;
  margin-top: -12px;
  width: 64px;
  border: solid 2px white;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 128px;
    margin-top: -24px;
    width: 128px;
  }
`

const AvatarWrap = styled.div`
  margin-bottom: 8px;
  text-align: center;
`

const StyledCard = styled(Card)`
  overflow: visible;
`

const StyledCardHeader = styled(CardHeader)<{ bg: string }>`
  position: relative;
  background: url(${({ bg }) => bg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 32px 32px 0 0;
  padding-top: 0;
  text-align: center;
`

const TeamName = styled(Heading).attrs({ as: 'h2' })`
  font-size: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <StyledCard>
        <StyledCardHeader bg={`/images/teams/${team.background}`}>
          <AvatarWrap>
            <Avatar src={`/images/teams/${team.images.md}`} alt="team avatar" />
          </AvatarWrap>
          <TeamName color={team.textColor}>{team.name}</TeamName>
          <Text as="p" color={team.textColor}>
            {t(team.description)}
          </Text>
        </StyledCardHeader>
        <CardBody>
          <StatBox icon={CommunityIcon} title={team.users} subtitle={t('Active Members')} />
        </CardBody>
      </StyledCard>
    </Wrapper>
  )
}

export default TeamCard
