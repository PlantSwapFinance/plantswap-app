import { MenuEntry } from '@plantswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

// The sidebar collapses to icons only, so keep the top level short: one entry
// per section (Trade / Earn / Impact / Community / More) and put the pages
// inside it. Clicking a section while collapsed expands the sidebar and opens it.
const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    items: [
      {
        label: t('Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity'),
        href: '/pool',
      },
    ],
  },
  {
    label: t('Earn'),
    icon: 'FarmIcon',
    items: [
      {
        label: t('Farms'),
        href: '/farms',
      },
      {
        label: t('Gardens'),
        href: '/gardens',
      },
      {
        label: t('Vertical Gardens'),
        href: '/verticalGardens',
      },
      {
        label: t('Collectibles Farms'),
        href: '/collectiblesFarms',
        status: {
          text: 'BETA',
          color: 'warning',
        },
      },
    ],
  },
  {
    label: t('Impact'),
    icon: 'ContributionIcon',
    items: [
      {
        label: t('Foundation'),
        href: '/foundation',
      },
      {
        label: t('Development Fund'),
        href: '/developmentFund',
      },
      {
        label: t('Roadmap'),
        href: '/roadmap',
      },
    ],
  },
  {
    label: t('Community'),
    icon: 'GroupsIcon',
    items: [
      {
        label: t('Leaderboard'),
        href: '/teams',
      },
      {
        label: t('Task Center'),
        href: '/profile/tasks',
      },
      {
        label: t('Your Profile'),
        href: '/profile',
      },
      {
        label: t('Collectibles'),
        href: '/collectibles',
      },
    ],
  },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Contact'),
        href: '/contact-us',
      },
      {
        label: t('Project'),
        href: '/project',
      },
      {
        label: t('Governance'),
        href: 'https://snapshot.box/#/s:plantswap.eth',
        target: '_blank',
      },
      {
        label: t('Blog'),
        href: 'https://plantswapfinance.medium.com',
        target: '_blank',
      },
      {
        label: t('Github'),
        href: 'https://github.com/plantswapfinance',
        target: '_blank',
      },
      {
        label: t('dex.guru'),
        href: 'https://dex.guru/token/0x58BA5Bd8872ec18BD360a9592149daed2fC57c69-bsc',
        target: '_blank',
      },
      {
        label: t('PlantSwap Token'),
        href: 'https://bscscan.com/token/0x58BA5Bd8872ec18BD360a9592149daed2fC57c69',
        target: '_blank',
      },
    ],
  },
]

export default config
