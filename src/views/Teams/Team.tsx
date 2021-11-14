import React from 'react'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { Link, Redirect, useParams } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text, Image } from '@plantswap/uikit'
import PageLoader from 'components/Loader/PageLoader'
import teams from 'config/constants/teams'
import { useTranslation } from 'contexts/Localization'
import { useTeam } from 'state/teams/hooks'
import TeamCard from './components/TeamCard'
import TeamHeader from './components/TeamHeader'

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const Team = () => {
  const { id: idStr }: { id: string } = useParams()
  const id = Number(idStr)
  const { t } = useTranslation()
  const isValidTeamId = teams.findIndex((team) => team.id === id) !== -1
  const team = useTeam(id)

  if (!isValidTeamId) {
    return <Redirect to="/404" />
  }

  if (!team) {
    return <PageLoader />
  }

  return (
    <Page>
      <TeamHeader />
      <Flex mb="24px">
        <Link to="/teams">
          <Flex alignItems="center">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{t('Teams Overview')}</Text>
          </Flex>
        </Link>
      </Flex>
      <TeamCard team={team} />
      <StyledImage src="/images/endPage.svg" alt="PlantSwap Finance" width={680} height={155} />
    </Page>
  )
}

export default Team
