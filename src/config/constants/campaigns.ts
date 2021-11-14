import { Campaign } from './types'

/**
 * id: The campaign id (required)
 * type: The type of the achievement
 * title: A string or an object to be translated.
 * Note: If the value is a string it is likely used as data in a translation object
 *
 * badge: Achievement avatar
 */

const campaigns: Campaign[] = [
  {
    id: '91',
    type: 'participation',
    title: 'Collected Active Lily',
    badge: 'achievement-gift.svg',
  },
  {
    id: '92',
    type: 'participation',
    title: 'Collected Active Gladiolus',
    badge: 'achievement-gift.svg',
  },
  {
    id: '93',
    type: 'participation',
    title: 'Collected Active Poppy',
    badge: 'achievement-gift.svg',
  },
  {
    id: '94',
    type: 'participation',
    title: 'Collected Active Hyacinth',
    badge: 'achievement-gift.svg',
  },
  {
    id: '95',
    type: 'participation',
    title: 'Collected Active Anemone',
    badge: 'achievement-gift.svg',
  },
  {
    id: '96',
    type: 'participation',
    title: 'Collected Active Tulip',
    badge: 'achievement-gift.svg',
  },
  {
    id: '97',
    type: 'participation',
    title: 'Collected Active Dianella',
    badge: 'achievement-gift.svg',
  },
  {
    id: '98',
    type: 'participation',
    title: 'Collected Active Orchid',
    badge: 'achievement-gift.svg',
  },
  {
    id: '99',
    type: 'participation',
    title: 'Collected Active Daffodil',
    badge: 'achievement-gift.svg',
  },
  {
    id: '100',
    type: 'participation',
    title: 'Collected Relax PLANT Farmer',
    badge: 'achievement-relax-plant.svg',
  },
  {
    id: '101',
    type: 'participation',
    title: 'Collected Relax PLANT BNB Gardener',
    badge: 'achievement-relax-plantBnb.svg',
  },
  {
    id: '102',
    type: 'participation',
    title: 'Collected Relax PLANT BUSD Farmer',
    badge: 'achievement-relax-plantBusd.svg',
  },
  {
    id: '103',
    type: 'participation',
    title: 'Collected Relax PLANT USDC Farmer',
    badge: 'achievement-relax-plantUsdc.svg',
  },
  {
    id: '104',
    type: 'participation',
    title: 'Collected Relax PLANT CAKE Gardener',
    badge: 'achievement-relax-plantCake.svg',
  },
]

/**
 * Transform the campaign config into a map. Keeps the config the same
 * as the others and allows easy access to a campaign by id
 */
export const campaignMap = new Map<string, Campaign>()

campaigns.forEach((campaign) => {
  campaignMap.set(campaign.id, campaign)
})

export default campaigns
