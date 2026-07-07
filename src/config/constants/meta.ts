import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const SITE_URL = 'https://plantswap.finance'
export const SITE_NAME = 'PlantSwap'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/plantswap.jpg`

export const DEFAULT_META: PageMeta = {
  title: 'PlantSwap',
  description:
    'PlantSwap is a DeFi platform on Binance Smart Chain (BSC) where you can farm $PLANT, stake in gardens, swap tokens, and support environmental causes like planting trees and protecting rainforests.',
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

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: joinTitle(t('Home'), 'PlantSwap'),
        description:
          'Farm $PLANT, stake in gardens, swap tokens on BSC, and help plant trees. PlantSwap is the DeFi platform that puts the planet first.',
        path,
      }
    case '/swap':
      return withMetaPath(
        buildMeta(path, t('Swap'), 'Swap tokens on PlantSwap — a fast, low-fee AMM on Binance Smart Chain.'),
        path,
      )
    case '/farms':
      return withMetaPath(
        buildMeta(
          path,
          t('Farms'),
          'Earn $PLANT and other rewards by providing liquidity to PlantSwap farms on BSC.',
        ),
        path,
      )
    case '/gardens':
      return withMetaPath(
        buildMeta(
          path,
          t('Gardens'),
          'Stake single tokens in PlantSwap gardens to earn $PLANT. Auto-compounding yield farming on BSC.',
        ),
        path,
      )
    case '/verticalGardens':
      return withMetaPath(
        buildMeta(
          path,
          t('Vertical Gardens'),
          'PlantSwap vertical gardens let you earn yield on partner tokens while supporting environmental causes.',
        ),
        path,
      )
    case '/collectiblesFarms':
      return withMetaPath(
        buildMeta(
          path,
          t('Collectibles Farms'),
          'Stake PlantSwap collectible NFTs to earn $PLANT and partner token rewards.',
        ),
        path,
      )
    case '/pools':
      return withMetaPath(
        buildMeta(path, t('Pools'), 'Stake $PLANT in PlantSwap pools to earn more tokens from new projects.'),
        path,
      )
    case '/collectibles':
      return withMetaPath(
        buildMeta(path, t('Collectibles'), 'PlantSwap collectibles — NFTs for the community, gamified farming, and more.'),
        path,
      )
    case '/market':
      return withMetaPath(
        buildMeta(
          path,
          t('Market'),
          'Trade PlantSwap NFTs on the peer-to-peer marketplace. Buy, sell, auction, and make offers.',
        ),
        path,
      )
    case '/foundation':
      return withMetaPath(
        buildMeta(
          path,
          t('Foundation'),
          'PlantSwap Foundation — community proposals funding rainforest protection, tree planting, and wildlife conservation.',
        ),
        path,
      )
    case '/vote':
      return withMetaPath(
        buildMeta(path, t('Vote'), 'Vote on PlantSwap governance proposals and shape the future of the protocol.'),
        path,
      )
    case '/documentation':
      return withMetaPath(
        buildMeta(path, t('Documentation'), 'PlantSwap documentation — guides, contracts, and developer resources.'),
        path,
      )
    case '/project':
      return withMetaPath(
        buildMeta(
          path,
          t('Project'),
          'PlantSwap mission — a BSC DeFi platform that funds tree planting, rainforest protection, and wildlife conservation through yield farming.',
        ),
        path,
      )
    case '/roadmap':
      return withMetaPath(
        buildMeta(path, t('Roadmap'), 'The PlantSwap roadmap — past milestones and what is next for $PLANT, farms, and the foundation.'),
        path,
      )
    case '/tree':
      return withMetaPath(
        buildMeta(
          path,
          t('Tree'),
          'PlantSwap tree of life — every tree planted by the Development Fund, recorded on-chain.',
        ),
        path,
      )
    case '/developmentFund':
      return withMetaPath(
        buildMeta(
          path,
          t('Development Fund'),
          'The PlantSwap Development Fund — proof of burn and donations to environmental non-profits like the Rainforest Foundation.',
        ),
        path,
      )
    case '/contact-us':
      return withMetaPath(
        buildMeta(path, t('Contact us'), 'Get in touch with the PlantSwap team — partnerships, support, and press.'),
        path,
      )
    case '/teams':
      return withMetaPath(
        buildMeta(path, t('Leaderboard'), 'PlantSwap teams leaderboard — climb the rankings and earn rewards.'),
        path,
      )
    case '/profile':
      return withMetaPath(
        buildMeta(path, t('Your Profile'), 'Your PlantSwap profile, achievements, and team standings.'),
        path,
      )
    case '/profile/tasks':
      return withMetaPath(
        buildMeta(path, t('Task Center'), 'Complete PlantSwap tasks to earn achievements and rewards.'),
        path,
      )
    case '/competition':
      return withMetaPath(
        buildMeta(path, t('Trading Battle'), 'PlantSwap trading battle — compete for the top spot.'),
        path,
      )
    case '/prediction':
      return withMetaPath(
        buildMeta(path, t('Prediction'), 'PlantSwap prediction markets — bet on token price movements.'),
        path,
      )
    case '/lottery':
      return withMetaPath(
        buildMeta(path, t('Lottery'), 'PlantSwap lottery — win $PLANT and other prizes.'),
        path,
      )
    default:
      return null
  }
}

export const getNoIndexPaths = (path: string): boolean => {
  // Admin / private / low-value
  if (path.startsWith('/dashboard')) return true
  // Wallet-specific / empty profiles
  if (path === '/profile') return true
  // Transaction flows and dynamic liquidity
  if (path.startsWith('/swap') && path !== '/swap') return true
  if (path.startsWith('/add') || path.startsWith('/remove')) return true
  if (path.startsWith('/create') || path === '/find') return true
  if (path === '/liquidity') return true
  // NFT listings and per-collection pages
  if (path.startsWith('/market/')) return true
  // Per-team and per-proposal pages
  if (/^\/teams\/\d+/.test(path)) return false
  if (path.startsWith('/voting/proposal/')) return false
  if (path.startsWith('/foundation/proposal/')) return false
  if (path.startsWith('/foundation/nonprofit/')) return false
  return false
}

export const getCanonicalUrl = (path: string): string => {
  const trimmed = path.split('?')[0].replace(/\/+$/, '') || '/'
  const normalized = trimmed === '/' ? '/' : trimmed
  return `${SITE_URL}${normalized}`
}
