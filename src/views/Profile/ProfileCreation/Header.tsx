import React, { useContext } from 'react'
import styled from 'styled-components'
import { Breadcrumbs, Heading, Text } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const steps = ['Get Starter Collectible', 'Set Profile Picture', 'Join Team'] // , 'Set Name'

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { currentStep } = useContext(ProfileCreationContext)

  return (
    <Wrapper>
      <Hero>
        <div>
            <Heading as="h1" scale="xxl" color="secondary">
              {t('Create your Profile')}
            </Heading>
            <Text bold>
              {t('Creat a unique profile by minting a Gardeners (NFT)and locking it in your profile.')}
            </Text>
            <Text bold>
              {t('This gardeners profile will give you access to special things...')}
            </Text>
            <Text color="secondary">
              {t('Total cost: 2 PLANT')}
            </Text>
        </div>
        <img src="/images/teams.svg" alt="Plantswap Teams" width={400} height={210} />
      </Hero>
      <Breadcrumbs>
        {steps.map((translationKey, index) => {
          return (
            <Text key={translationKey} color={index <= currentStep ? 'text' : 'textDisabled'}>
              {t(translationKey)}
            </Text>
          )
        })}
      </Breadcrumbs>
    </Wrapper>
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

export default Header
