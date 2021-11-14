export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }
export interface Address {
  97?: string
  56: string
}

export interface Token {
  symbol: string
  address?: Address
  decimals?: number
  projectLink?: string
  busdPrice?: string
}

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

interface IfoPoolInfo {
  saleAmount: string
  raiseAmount: string
  plantToBurn: string
  distributionRatio: number // Range [0-1]
}

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  currency: Token
  token: Token
  releaseBlockNumber: number
  articleUrl: string
  campaignId: string
  tokenOfferingPrice: number
  version: number
  [PoolIds.poolBasic]?: IfoPoolInfo
  [PoolIds.poolUnlimited]: IfoPoolInfo
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export enum VerticalGardenCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'PANCAKE' = 'PlantSwap',
  'CAFE' = 'CafeSwap',
  'GOOSE' = 'GooseFinance',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
}

export enum CollectiblesFarmCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'PANCAKE' = 'PlantSwap',
  'CAFE' = 'CafeSwap',
  'GOOSE' = 'GooseFinance',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
}

export interface FarmConfig {
  pid: number
  risk?: number
  lpSymbol: string
  lpAddresses: Address
  token: Token
  quoteToken: Token
  rewardToken?: Token
  multiplier?: string
  depositFee?: number
  isCommunity?: boolean
  isTokenOnly?: boolean
  isOnlyForBackground?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface VerticalGardenConfig {
  vgId: number
  stakingToken: Token
  stakingRewardToken: Token
  verticalEarningToken: Token
  verticalGardenContractAddress: Address
  verticalGardenMasterGardenerPId?: number
  verticalGardenMasterGardenerAllocPt?: number
  stakingTokenPrice?: number
  verticalGardenCategory?: VerticalGardenCategory
  harvest?: boolean
  sortOrder?: number
  isFinished?: boolean
  stakingLimit?: number
  depositFee?: number
  rewardCut?: number
  rewardCutSplitDevelopmentFund?: number
  rewardCutSplitBuyPlantAndBurn?: number
  displayOnHomePage?: boolean
}

export interface CollectiblesFarmConfig {
  cfId: number
  label: string
  labelSvg?: string
  description?: string
  collectiblesFarmingPoolContract: Address
  stakingRewardToken: Token
  stakingExtraRewardToken?: Token
  collectiblesFarmMasterGardenerPId?: number
  collectiblesFarmMasterGardenerAllocPt?: number
  collectiblesFarmCategory?: CollectiblesFarmCategory
  harvest?: boolean
  sortOrder?: number
  isFinished?: boolean
  isExtraReward?: boolean
  displayOnHomePage?: boolean
}

export interface PoolConfig {
  sousId: number
  earningToken: Token
  stakingToken: Token
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  enableEmergencyWithdraw?: boolean
}

export interface EcologicalNonProfitConfig {
  enpId: number
  description?: string
  isValid?: boolean
}  

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type NftImages = {
  blur?: string
} & Images

export type NftVideo = {
  webm: string
  mp4: string
}

export type NftSource = {
  [key in NftType]: {
    address: Address
    identifierKey: string
  }
}

export enum NftType {
  GARDENERS = 'gardener',
  PANCAKE = 'pancake',
  MIXIE = 'mixie',
}

export type Nft = {
  description: string
  requirement?: string
  name: string
  images: NftImages
  sortOrder: number
  type: NftType
  video?: NftVideo

  // Uniquely identifies the nft.
  // Used for matching an NFT from the config with the data from the NFT's tokenURI
  identifier: string

  // Used to be "bunnyId". Used when minting NFT
  variationId?: number
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'participation' | 'teambattle' | 'ifo'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type TaskType = 'participation' | 'foundation' | 'donation' | 'market'

export type Task = {
  id: string
  type: TaskType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}