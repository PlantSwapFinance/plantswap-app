import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PlantSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PlantSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://plantswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('PlantSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('PlantSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('PlantSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('PlantSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('PlantSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('PlantSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('PlantSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('PlantSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('PlantSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('PlantSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('PlantSwap')}`,
      }
    default:
      return null
  }
}
