import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@plantswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from 'contexts/Localization'
import HeaderWrapper from 'views/Profile/components/HeaderWrapper'
import NoProfileCard from './NoProfileCard'

const TeamHeader = () => {
  const { t } = useTranslation()
  const { isInitialized, profile } = useProfile()
  const showProfileCallout = isInitialized && !profile

  return (
    <>
      {showProfileCallout && <NoProfileCard />}
      <HeaderWrapper>
          <Hero>
            <div>
            <Heading as="h1" scale="xxl" color="secondary">
              {t('Teams & Profiles')}
            </Heading>
            <Text bold>
              {t('Have a look at the different Gardeners Teams')}
            </Text>
            <Text bold>
              {t('Each month we donate funds to ecological')}
            </Text>
            <Text bold>
              {t('foundations in line with these teams names & descriptions.')}
            </Text>
            </div>
            <img src="/images/teams.svg" alt="Plantswap Teams" width={400} height={210} />
          </Hero>
      </HeaderWrapper>
    </>
  )
}

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`

export default TeamHeader
