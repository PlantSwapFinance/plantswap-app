import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import Hero from './components/Hero'
import { plantSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
import PlantDataRow from './components/PlantDataRow'
import UserBanner from './components/UserBanner'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper } from './components/WedgeSvgs'
import DevelopmentFund from './components/DevelopmentFund'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { usePricePlantBusd } from '../../state/farms/hooks'
import { DEFAULT_META, SITE_NAME, getCanonicalUrl } from '../../config/constants/meta'

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
  const { account } = useActiveWeb3React()
  const plantPriceUsd = usePricePlantBusd()
  const plantPriceUsdDisplay = plantPriceUsd.gt(0)
    ? `$${plantPriceUsd.toNumber().toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`
    : ''

  const homeTitle = plantPriceUsdDisplay
    ? `${DEFAULT_META.title} - ${plantPriceUsdDisplay}`
    : `${DEFAULT_META.title} - Farm $PLANT and help plant trees`
  const canonical = getCanonicalUrl('/')

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <Helmet>
        <title>{homeTitle}</title>
        <meta name="description" content={DEFAULT_META.description} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={DEFAULT_META.title} />
        <meta property="og:description" content={DEFAULT_META.description} />
        <meta property="og:image" content={DEFAULT_META.image} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_META.title} />
        <meta name="twitter:description" content={DEFAULT_META.description} />
        <meta name="twitter:image" content={DEFAULT_META.image} />
      </Helmet>
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
