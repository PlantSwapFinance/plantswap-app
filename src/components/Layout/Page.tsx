import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import {
  DEFAULT_META,
  SITE_NAME,
  getCustomMeta,
  getNoIndexPaths,
  getCanonicalUrl,
} from 'config/constants/meta'
import { usePricePlantBusd } from 'state/farms/hooks'
import Container from './Container'

const StyledPage = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

const PageMeta = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const plantPriceUsd = usePricePlantBusd()
  const plantPriceUsdDisplay = plantPriceUsd.gt(0)
    ? `$${plantPriceUsd.toNumber().toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`
    : ''

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image, noindex } = { ...DEFAULT_META, ...pageMeta }
  const pageTitle = plantPriceUsdDisplay ? [title, plantPriceUsdDisplay].join(' - ') : title

  const robots = useMemo(() => {
    if (noindex || getNoIndexPaths(pathname)) return 'noindex, nofollow'
    return 'index, follow, max-image-preview:large, max-snippet:-1'
  }, [noindex, pathname])

  const canonical = getCanonicalUrl(pathname)
  const ogUrl = getCanonicalUrl(pathname)

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@plantswap" />
    </Helmet>
  )
}

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page