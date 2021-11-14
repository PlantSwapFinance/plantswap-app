import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import Hero from './components/Hero'
import { proposeSectionData, donateSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
import PlantDataRow from './components/PlantDataRow'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper } from './components/WedgeSvgs'
import { Proposals } from './components/Proposals'
import DevelopmentFund from './components/DevelopmentFund'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const Foundation: React.FC = () => {
  const { theme } = useTheme()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const FoundationSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'radial-gradient(103.12% 50% at 50% 50%, #4D2419 0%, #2D221F 100%)'
            : 'linear-gradient(139.73deg, #FFFFFF 0%, #71BE63 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: FoundationSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <>
        </>
      </PageSection>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...proposeSectionData} />
        <br />
        <PlantDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
          ? 'radial-gradient(103.12% 50% at 50% 50%, #4D2419 0%, #2D221F 100%)'
          : 'linear-gradient(139.73deg, #FFFFFF 0%, #71BE63 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
      <OuterWedgeWrapper>
        <InnerWedgeWrapper top fill={theme.isDark ? '#2B4A13' : '#D3FDB2'}>
          <WedgeTopLeft />
        </InnerWedgeWrapper>
      </OuterWedgeWrapper>
        <SalesSection {...donateSectionData} />
      </PageSection>
      
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        index={2}
        hasCurvedDivider={false}
      >
      <OuterWedgeWrapper>
        <InnerWedgeWrapper top fill={theme.isDark ? '#2B4A13' : '#D3FDB2'}>
          <WedgeTopLeft />
        </InnerWedgeWrapper>
      </OuterWedgeWrapper>
      </PageSection>

      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        index={2}
        hasCurvedDivider={false}
      >
        <Content>
          <Proposals />
        </Content>
      </PageSection>
      
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        index={2}
        hasCurvedDivider={false}
      >
        
        <DevelopmentFund />
      </PageSection>
    </>
  )
}

export default Foundation
