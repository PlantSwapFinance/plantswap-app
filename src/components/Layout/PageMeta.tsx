import React, { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_META,
  SITE_NAME,
  getCustomMeta,
  getNoIndexPaths,
  getCanonicalUrl,
  isKnownRoute,
} from 'config/constants/meta'

const PageMeta = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image, noindex, schema } = { ...DEFAULT_META, ...pageMeta }

  const robots = useMemo(() => {
    if (noindex || getNoIndexPaths(pathname) || !isKnownRoute(pathname)) return 'noindex, nofollow'
    return 'index, follow, max-image-preview:large, max-snippet:-1'
  }, [noindex, pathname])

  const canonical = getCanonicalUrl(pathname)

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@plantswap" />

      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}

export default PageMeta
