import tokens from './tokens'
import { CollectiblesFarmConfig, CollectiblesFarmCategory } from './types'

const collectiblesFarms: CollectiblesFarmConfig[] = [
  {
    cfId: 0,
    label: 'All Gardeners',
    description: 'This collectibles farm accept all gardeners.',
    collectiblesFarmingPoolContract: {
      56: '0x0A9497cA5E87853859594f2428fA0Ba509827971',
      97: '',
    },
    stakingRewardToken: tokens.plant,
    collectiblesFarmMasterGardenerPId: 18,
    collectiblesFarmMasterGardenerAllocPt: 30,
    collectiblesFarmCategory: CollectiblesFarmCategory.CORE,
    harvest: true,
    sortOrder: 1,
    isFinished: false,
    isExtraReward: false,
    displayOnHomePage: true,
  }, 
  /* {
    cfId: 1,
    label: 'Casual Gardeners',
    labelSvg: 'collectiblesFarmCasualGardeners.svg',
    description: 'This collectibles farm accept only one of the first 5 Gardeners: Casual Farmer, Casual Gardener, Pickup, Tractor and Scarecrow.',
    collectiblesFarmingPoolContract: {
      56: '0x9a288af108b40cE75A18fa7D45B1deF4e0bdD80e',
      97: '',
    },
    stakingRewardToken: tokens.plant,
    collectiblesFarmMasterGardenerPId: 19,
    collectiblesFarmMasterGardenerAllocPt: 30,
    collectiblesFarmCategory: CollectiblesFarmCategory.CORE,
    harvest: true,
    sortOrder: 1,
    isFinished: false,
    displayOnHomePage: true,
  }, */
  /* {
    cfId: 2,
    label: 'All Gardeners',
    collectiblesFarmingPoolContract: {
      56: '0x4a8Ac393d9b4339BfC37FE96B7A3059918baAaeB',
      97: '0x119D8957933Ddb0a17B0Bdb937AabAF49dBaC345',
    },
    stakingRewardToken: tokens.plant,
    collectiblesFarmMasterGardenerPId: 19,
    collectiblesFarmMasterGardenerAllocPt: 30,
    collectiblesFarmCategory: CollectiblesFarmCategory.CORE,
    harvest: true,
    sortOrder: 1,
    isFinished: false,
    displayOnHomePage: true,
  }, */
]

export default collectiblesFarms
