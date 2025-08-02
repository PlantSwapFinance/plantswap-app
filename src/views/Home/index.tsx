import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useAccount } from 'wagmi'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import Hero from './components/Hero'
import { plantSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
import PlantDataRow from './components/PlantDataRow'
import UserBanner from './components/UserBanner'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper } from './components/WedgeSvgs'
import DevelopmentFund from './components/DevelopmentFund'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0px;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { address: account } = useAccount()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(139.73deg, #2D221F 25%, #183224 100%)'
            : 'linear-gradient(139.73deg, #FFFFFF 0%, #71BE63 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {account && (
          <UserBannerWrapper>
            <UserBanner />
          </UserBannerWrapper>
        )}
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...plantSectionData} />
        <PlantDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
          ? 'radial-gradient(103.12% 50% at 10% 50%, #183224 0%, #2D221F 100%)'
          : 'linear-gradient(139.73deg, #FFFFFF 0%, #71BE63 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
      <OuterWedgeWrapper>
        <InnerWedgeWrapper top fill={theme.isDark ? '#183224' : '#D3FDB2'}>
          <WedgeTopLeft />
        </InnerWedgeWrapper>
      </OuterWedgeWrapper>
        <DevelopmentFund />
      </PageSection>
    </>
  )
}

export default Home
