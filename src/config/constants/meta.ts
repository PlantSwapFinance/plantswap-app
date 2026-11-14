import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const SITE_URL = 'https://plantswap.finance'
export const SITE_NAME = 'PlantSwap'

const og = (filename: string) => `${SITE_URL}/images/${filename}`

export const DEFAULT_OG_IMAGE = og('plantswap.jpg')

// X, Facebook, LinkedIn, Slack and most chat apps do not render SVG share
// images, so every section points at the raster default until a dedicated
// 1200x630 JPG/PNG card exists for it.
export const OG_IMAGES = {
  farms: DEFAULT_OG_IMAGE,
  garden: DEFAULT_OG_IMAGE,
  verticalGardens: DEFAULT_OG_IMAGE,
  collectibles: DEFAULT_OG_IMAGE,
  foundation: DEFAULT_OG_IMAGE,
  developmentFund: DEFAULT_OG_IMAGE,
  project: DEFAULT_OG_IMAGE,
  roadmap: DEFAULT_OG_IMAGE,
  tree: DEFAULT_OG_IMAGE,
  teams: DEFAULT_OG_IMAGE,
}

export const DEFAULT_META: PageMeta = {
  title: 'PlantSwap',
  description:
    'PlantSwap is a DeFi platform on Binance Smart Chain: swap tokens, farm $PLANT, stake in gardens, and fund tree planting and rainforest protection.',
  image: DEFAULT_OG_IMAGE,
}

const joinTitle = (pageTitle: string, brand: string) => `${pageTitle} | ${brand}`

const buildMeta = (path: string, title: string, description: string, image?: string, noindex = false): PageMeta => ({
  title: joinTitle(title, 'PlantSwap'),
  description,
  image: image || DEFAULT_OG_IMAGE,
  path,
  noindex,
})

const withMetaPath = (meta: PageMeta | null, path: string): PageMeta | null => {
  if (!meta) return meta
  return { ...meta, path }
}

const breadcrumb = (path: string, trail: { name: string; item: string }[]): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((it, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: it.name,
    item: it.item,
  })),
})

const proposalSchema = (path: string, section: 'Foundation' | 'Voting', parent: string) => ({
  title: joinTitle(`${section} Proposal`, 'PlantSwap'),
  description:
    section === 'Foundation'
      ? 'PlantSwap Foundation proposal — community-voted environmental funding.'
      : 'PlantSwap governance proposal — community voting.',
  image: OG_IMAGES.foundation,
  path,
  schema: breadcrumb(path, [
    { name: 'Home', item: `${SITE_URL}/` },
    { name: section, item: `${SITE_URL}${parent}` },
    { name: 'Proposal', item: `${SITE_URL}${path}` },
  ]),
})

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta | null => {
  if (path === '/') {
    return {
      title: t('PlantSwap — Farm $PLANT on BSC and Help Plant Trees'),
      description:
        'Farm $PLANT, stake in gardens, swap tokens on BSC, and help plant trees. PlantSwap is the DeFi platform that puts the planet first.',
      image: DEFAULT_OG_IMAGE,
      path,
    }
  }

  // Foundation family
  if (path === '/foundation') {
    return withMetaPath(
      buildMeta(
        path,
        t('Foundation — Community Environmental Funding'),
        'PlantSwap Foundation — community proposals funding rainforest protection, tree planting, and wildlife conservation.',
        OG_IMAGES.foundation,
      ),
      path,
    )
  }
  if (path === '/foundation/donate') {
    return withMetaPath(
      buildMeta(
        path,
        t('Donate to Environmental Non-Profits'),
        'Donate to PlantSwap Foundation environmental partners — rainforest protection, tree planting, wildlife conservation.',
        OG_IMAGES.foundation,
      ),
      path,
    )
  }
  if (path === '/foundation/proposal/create') {
    return withMetaPath(
      buildMeta(path, t('Create Proposal'), 'Create a PlantSwap Foundation proposal.', OG_IMAGES.foundation, true),
      path,
    )
  }
  if (/^\/foundation\/proposal\/\d+/.test(path)) {
    return { ...proposalSchema(path, 'Foundation', '/foundation'), path }
  }
  if (/^\/foundation\/nonprofit\/\d+/.test(path)) {
    return {
      title: joinTitle(t('Nonprofit'), 'PlantSwap'),
      description: 'PlantSwap Foundation nonprofit partner — environmental organization funded by the community.',
      image: OG_IMAGES.foundation,
      path,
      schema: breadcrumb(path, [
        { name: 'Home', item: `${SITE_URL}/` },
        { name: 'Foundation', item: `${SITE_URL}/foundation` },
        { name: 'Nonprofit', item: `${SITE_URL}${path}` },
      ]),
    }
  }

  // Voting (dev-only routes; kept noindex in prod)
  if (path === '/voting') {
    return withMetaPath(
      buildMeta(
        path,
        t('Voting'),
        'PlantSwap governance voting — review and vote on community proposals.',
        OG_IMAGES.foundation,
        true,
      ),
      path,
    )
  }
  if (path === '/voting/proposal/create') {
    return withMetaPath(
      buildMeta(
        path,
        t('Create Voting Proposal'),
        'Create a PlantSwap governance proposal.',
        OG_IMAGES.foundation,
        true,
      ),
      path,
    )
  }
  if (/^\/voting\/proposal\/\d+/.test(path)) {
    return { ...proposalSchema(path, 'Voting', '/voting'), path }
  }

  // Teams
  if (path === '/teams') {
    return withMetaPath(
      buildMeta(
        path,
        t('Teams Leaderboard'),
        'PlantSwap teams leaderboard — climb the rankings and earn rewards.',
        OG_IMAGES.teams,
      ),
      path,
    )
  }
  if (/^\/teams\/\d+/.test(path)) {
    return {
      title: joinTitle(t('Team'), 'PlantSwap'),
      description: 'PlantSwap team page — members and standings.',
      image: OG_IMAGES.teams,
      path,
      schema: breadcrumb(path, [
        { name: 'Home', item: `${SITE_URL}/` },
        { name: 'Teams', item: `${SITE_URL}/teams` },
        { name: 'Team', item: `${SITE_URL}${path}` },
      ]),
    }
  }

  // Dashboard
  if (path === '/dashboard') {
    return withMetaPath(buildMeta(path, t('Dashboard'), 'Your PlantSwap dashboard.', undefined, true), path)
  }

  // Liquidity flow — noindexed
  if (path === '/liquidity' || path === '/find') {
    return withMetaPath(
      buildMeta(path, t('Liquidity'), 'PlantSwap liquidity pools on Binance Smart Chain.', undefined, true),
      path,
    )
  }
  if (path.startsWith('/add') || path.startsWith('/remove') || path.startsWith('/create')) {
    return withMetaPath(
      buildMeta(path, t('Add Liquidity'), 'PlantSwap liquidity pools on Binance Smart Chain.', undefined, true),
      path,
    )
  }

  // Swap params — noindexed
  if (path.startsWith('/swap/')) {
    return withMetaPath(buildMeta(path, t('Swap Output'), 'Swap a specific token on PlantSwap.', undefined, true), path)
  }

  // Marketing pages
  if (path === '/swap') {
    return withMetaPath(
      buildMeta(
        path,
        t('Swap BEP-20 Tokens on BSC'),
        'Swap tokens on PlantSwap — a fast, low-fee AMM on Binance Smart Chain.',
      ),
      path,
    )
  }
  if (path === '/farms') {
    return withMetaPath(
      buildMeta(
        path,
        t('Yield Farms — Earn $PLANT with LP Tokens'),
        'Earn $PLANT and other rewards by providing liquidity to PlantSwap farms on BSC.',
        OG_IMAGES.farms,
      ),
      path,
    )
  }
  if (path === '/gardens') {
    return withMetaPath(
      buildMeta(
        path,
        t('Gardens — Stake Single Tokens to Earn $PLANT'),
        'Stake single tokens in PlantSwap gardens to earn $PLANT. Auto-compounding yield farming on BSC.',
        OG_IMAGES.garden,
      ),
      path,
    )
  }
  if (path === '/verticalGardens') {
    return withMetaPath(
      buildMeta(
        path,
        t('Vertical Gardens — Earn Yield on Partner Tokens'),
        'PlantSwap vertical gardens let you earn yield on partner tokens while supporting environmental causes.',
        OG_IMAGES.verticalGardens,
      ),
      path,
    )
  }
  if (path === '/collectiblesFarms') {
    return withMetaPath(
      buildMeta(
        path,
        t('Collectibles Farms — Stake NFTs for Rewards'),
        'Stake PlantSwap collectible NFTs to earn $PLANT and partner token rewards.',
        OG_IMAGES.collectibles,
      ),
      path,
    )
  }
  if (path === '/pools') {
    return withMetaPath(
      buildMeta(
        path,
        t('Pools — Stake $PLANT to Earn New Tokens'),
        'Stake $PLANT in PlantSwap pools to earn more tokens from new projects.',
      ),
      path,
    )
  }
  if (path === '/collectibles') {
    return withMetaPath(
      buildMeta(
        path,
        t('Collectibles — NFTs for Gamified Farming'),
        'PlantSwap collectibles — NFTs for the community, gamified farming, and more.',
        OG_IMAGES.collectibles,
      ),
      path,
    )
  }
  if (path === '/market') {
    return withMetaPath(
      buildMeta(
        path,
        t('NFT Market — Buy, Sell and Auction NFTs'),
        'Trade PlantSwap NFTs on the peer-to-peer marketplace. Buy, sell, auction, and make offers.',
      ),
      path,
    )
  }
  if (path === '/vote') {
    return withMetaPath(
      buildMeta(path, t('Vote'), 'Vote on PlantSwap governance proposals via Snapshot.', undefined, true),
      path,
    )
  }
  if (path === '/documentation') {
    return withMetaPath(
      buildMeta(
        path,
        t('Documentation'),
        'PlantSwap documentation — guides, contracts, and developer resources.',
        undefined,
        true,
      ),
      path,
    )
  }
  if (path === '/project') {
    return withMetaPath(
      buildMeta(
        path,
        t('About the Project — DeFi That Plants Trees'),
        'PlantSwap mission — a BSC DeFi platform that funds tree planting, rainforest protection, and wildlife conservation through yield farming.',
        OG_IMAGES.project,
      ),
      path,
    )
  }
  if (path === '/roadmap') {
    return withMetaPath(
      buildMeta(
        path,
        t('Roadmap — Milestones and What Is Next'),
        'The PlantSwap roadmap — past milestones and what is next for $PLANT, farms, and the foundation.',
        OG_IMAGES.roadmap,
      ),
      path,
    )
  }
  if (path === '/tree') {
    return withMetaPath(
      buildMeta(
        path,
        t('Tree of Life — Trees Planted On-Chain'),
        'PlantSwap tree of life — every tree planted by the Development Fund, recorded on-chain.',
        OG_IMAGES.tree,
      ),
      path,
    )
  }
  if (path === '/developmentFund') {
    return withMetaPath(
      buildMeta(
        path,
        t('Development Fund — Burns and Donations'),
        'The PlantSwap Development Fund — proof of burn and donations to environmental non-profits like the Rainforest Foundation.',
        OG_IMAGES.developmentFund,
      ),
      path,
    )
  }
  if (path === '/contact-us') {
    return withMetaPath(
      buildMeta(
        path,
        t('Contact Us — Partnerships, Support, Press'),
        'Get in touch with the PlantSwap team — partnerships, support, and press.',
      ),
      path,
    )
  }
  if (path === '/profile') {
    return withMetaPath(
      buildMeta(path, t('Your Profile'), 'Your PlantSwap profile, achievements, and team standings.', undefined, true),
      path,
    )
  }
  if (path === '/profile/tasks') {
    return withMetaPath(
      buildMeta(path, t('Task Center'), 'Complete PlantSwap tasks to earn achievements and rewards.', undefined, true),
      path,
    )
  }
  if (path === '/competition') {
    return withMetaPath(
      buildMeta(path, t('Trading Battle'), 'PlantSwap trading battle — compete for the top spot.'),
      path,
    )
  }
  if (path === '/prediction') {
    return withMetaPath(
      buildMeta(path, t('Prediction'), 'PlantSwap prediction markets — bet on token price movements.'),
      path,
    )
  }

  return null
}

// Source of truth for which paths exist as real routes. PageMeta uses it to
// noindex unknown URLs; the sitemap generator uses it to know which URLs to list.
export const KNOWN_ROUTES: Set<string> = new Set([
  '/',
  '/swap',
  '/swap/:outputCurrency',
  '/farms',
  '/gardens',
  '/verticalGardens',
  '/collectiblesFarms',
  '/pools',
  '/collectibles',
  '/market',
  '/foundation',
  '/foundation/donate',
  '/foundation/proposal/create',
  '/foundation/proposal/:id',
  '/foundation/nonprofit/:id',
  '/voting',
  '/voting/proposal/create',
  '/voting/proposal/:id',
  '/teams',
  '/teams/:id',
  '/dashboard',
  '/liquidity',
  '/find',
  '/add',
  '/add/:currencyIdA',
  '/add/:currencyIdA/:currencyIdB',
  '/remove/:tokens',
  '/remove/:currencyIdA/:currencyIdB',
  '/create',
  '/create/:currencyIdA',
  '/create/:currencyIdA/:currencyIdB',
  '/vote',
  '/documentation',
  '/project',
  '/roadmap',
  '/tree',
  '/developmentFund',
  '/contact-us',
  '/profile',
  '/profile/tasks',
  '/competition',
  '/prediction',
])

export const KNOWN_ROUTE_PATTERNS: RegExp[] = [
  /^\/foundation\/proposal\/\d+$/,
  /^\/foundation\/nonprofit\/\d+$/,
  /^\/voting\/proposal\/\d+$/,
  /^\/teams\/\d+$/,
  /^\/add(\/[^/]+){0,2}$/,
  /^\/remove(\/[^/]+){0,2}$/,
  /^\/create(\/[^/]+){0,2}$/,
  /^\/swap\/[^/]+$/,
]

export const isKnownRoute = (path: string): boolean => {
  if (KNOWN_ROUTES.has(path)) return true
  return KNOWN_ROUTE_PATTERNS.some((re) => re.test(path))
}

export const getNoIndexPaths = (path: string): boolean => {
  if (path === '/dashboard') return true
  if (path === '/profile' || path === '/profile/tasks') return true
  if (path.startsWith('/market/')) return true
  if (path.startsWith('/swap/')) return true
  if (path === '/liquidity' || path === '/find') return true
  if (path.startsWith('/add') || path.startsWith('/remove') || path.startsWith('/create')) return true
  return false
}

export const getCanonicalUrl = (path: string): string => {
  const trimmed = path.split('?')[0].replace(/\/+$/, '') || '/'
  const normalized = trimmed === '/' ? '/' : trimmed
  return `${SITE_URL}${normalized}`
}

export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export interface IndexableRoute {
  path: string
  // Short label used for navigation, breadcrumbs and llms.txt.
  name: string
  changefreq: ChangeFreq
  priority: number
  // Files whose last git commit date becomes the sitemap <lastmod>.
  sources: string[]
}

// Public, canonical pages that search engines and AI crawlers should index.
// Read by scripts/generateSitemap.ts (sitemap.xml) and scripts/prerender.ts
// (per-route static HTML and llms.txt). Dynamic routes such as
// /foundation/proposal/:id are intentionally left out.
export const INDEXABLE_ROUTES: IndexableRoute[] = [
  { path: '/', name: 'Home', changefreq: 'daily', priority: 1.0, sources: ['src/views/Home'] },
  { path: '/swap', name: 'Swap', changefreq: 'daily', priority: 0.9, sources: ['src/views/Swap'] },
  { path: '/farms', name: 'Farms', changefreq: 'hourly', priority: 0.9, sources: ['src/views/Farms'] },
  { path: '/gardens', name: 'Gardens', changefreq: 'hourly', priority: 0.9, sources: ['src/views/Gardens'] },
  { path: '/pools', name: 'Pools', changefreq: 'hourly', priority: 0.9, sources: ['src/views/Pools'] },
  {
    path: '/verticalGardens',
    name: 'Vertical Gardens',
    changefreq: 'daily',
    priority: 0.8,
    sources: ['src/views/VerticalGardens'],
  },
  {
    path: '/collectiblesFarms',
    name: 'Collectibles Farms',
    changefreq: 'daily',
    priority: 0.8,
    sources: ['src/views/CollectiblesFarms'],
  },
  {
    path: '/collectibles',
    name: 'Collectibles',
    changefreq: 'daily',
    priority: 0.8,
    sources: ['src/views/Collectibles'],
  },
  { path: '/market', name: 'NFT Market', changefreq: 'daily', priority: 0.8, sources: ['src/views/Market'] },
  { path: '/foundation', name: 'Foundation', changefreq: 'daily', priority: 0.8, sources: ['src/views/Foundation'] },
  {
    path: '/foundation/donate',
    name: 'Donate',
    changefreq: 'weekly',
    priority: 0.7,
    sources: ['src/views/Donation.tsx'],
  },
  {
    path: '/project',
    name: 'Project',
    changefreq: 'monthly',
    priority: 0.7,
    sources: ['src/views/Project', 'src/config/constants/faq.ts'],
  },
  { path: '/roadmap', name: 'Roadmap', changefreq: 'monthly', priority: 0.7, sources: ['src/views/Roadmap'] },
  {
    path: '/developmentFund',
    name: 'Development Fund',
    changefreq: 'weekly',
    priority: 0.7,
    sources: ['src/views/DevelopmentFund'],
  },
  { path: '/tree', name: 'Tree of Life', changefreq: 'weekly', priority: 0.7, sources: ['src/views/Tree'] },
  { path: '/teams', name: 'Teams', changefreq: 'daily', priority: 0.5, sources: ['src/views/Teams'] },
  { path: '/contact-us', name: 'Contact Us', changefreq: 'yearly', priority: 0.4, sources: ['src/views/ContactUs'] },
]

// JSON-LD blocks for a page: the page's own schema when it defines one,
// otherwise WebPage + BreadcrumbList for indexable routes. Shared by PageMeta
// (rendered app) and scripts/prerender.ts (static HTML) so both stay identical.
export const getPageSchemas = (path: string, meta: PageMeta): Record<string, unknown>[] => {
  if (meta.schema) return [meta.schema]
  const route = INDEXABLE_ROUTES.find((r) => r.path === path)
  if (!route || route.path === '/') return []
  const url = getCanonicalUrl(path)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.description,
      url,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
    },
    breadcrumb(path, [
      { name: 'Home', item: `${SITE_URL}/` },
      { name: route.name, item: url },
    ]),
  ]
}
