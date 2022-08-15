import tokens from './tokens'
import { VerticalGardenConfig, VerticalGardenCategory } from './types'

const verticalGardens: VerticalGardenConfig[] = [
  
  {
    vgId: 8,
    stakingToken: tokens.cake,
    stakingRewardToken: tokens.cake,
    verticalEarningToken: tokens.plant,
    verticalGardenContractAddress: {
      56: '0xBCb7b63B90459D536200Eb73f5b4D746da52A411',
      97: '',
    },
    verticalGardenMasterGardenerPId: 18,
    verticalGardenMasterGardenerAllocPt: 60,
    stakingTokenPrice: 16,
    verticalGardenCategory: VerticalGardenCategory.PANCAKE,
    harvest: true,
    sortOrder: 1,
    isFinished: true,
    depositFee: 100, // 1%
    rewardCut: 1500, // 15%
    rewardCutSplitDevelopmentFund: 50, // 50% of 15%
    rewardCutSplitBuyPlantAndBurn: 50, // 50% of 15%
    displayOnHomePage: false,
  },
  {
    vgId: 1,
    stakingToken: tokens.cake,
    stakingRewardToken: tokens.oddz,
    verticalEarningToken: tokens.plant,
    verticalGardenContractAddress: {
      56: '0x32121B2a1eD671dd0F1FC28Fffb5F1500b08A327',
      97: '',
    },
    verticalGardenMasterGardenerPId: 19,
    verticalGardenMasterGardenerAllocPt: 30,
    stakingTokenPrice: 16,
    verticalGardenCategory: VerticalGardenCategory.PANCAKE,
    harvest: true,
    sortOrder: 1,
    isFinished: true,
    depositFee: 100, // 1%
    rewardCut: 1500, // 15%
    rewardCutSplitDevelopmentFund: 50, // 50% of 15%
    rewardCutSplitBuyPlantAndBurn: 50, // 50% of 15%
    displayOnHomePage: false,
  },
  {
    vgId: 2,
    stakingToken: tokens.brew,
    stakingRewardToken: tokens.brew,
    verticalEarningToken: tokens.plant,
    verticalGardenContractAddress: {
      56: '0xE7F2a4EAaFf2532DA98dC8d987D7C19B6803Fcac',
      97: '',
    },
    verticalGardenMasterGardenerPId: 21,
    verticalGardenMasterGardenerAllocPt: 0,
    stakingTokenPrice: 0.8,
    verticalGardenCategory: VerticalGardenCategory.CAFE,
    harvest: true,
    sortOrder: 6,
    isFinished: true,
    depositFee: 100, // 1%
    rewardCut: 1500, // 15%
    rewardCutSplitDevelopmentFund: 50, // 50% of 15%
    rewardCutSplitBuyPlantAndBurn: 50, // 50% of 15%
    displayOnHomePage: false,
  },
  {
    vgId: 3,
    stakingToken: tokens.eggp,
    stakingRewardToken: tokens.eggp,
    verticalEarningToken: tokens.plant,
    verticalGardenContractAddress: {
      56: '0x57BA57DCDd0f8D7620762209B1B118321A7F8Aa0',
      97: '',
    },
    verticalGardenMasterGardenerPId: 24,
    verticalGardenMasterGardenerAllocPt: 5,
    stakingTokenPrice: 0.11,
    verticalGardenCategory: VerticalGardenCategory.COMMUNITY,
    harvest: true,
    sortOrder: 4,
    isFinished: true,
    depositFee: 100, // 1%
    rewardCut: 1500, // 15%
    rewardCutSplitDevelopmentFund: 50, // 50% of 15%
    rewardCutSplitBuyPlantAndBurn: 50, // 50% of 15%
    displayOnHomePage: false,
  },
  {
    vgId: 4,
    stakingToken: tokens.cake,
    stakingRewardToken: tokens.chess,
    verticalEarningToken: tokens.plant,
    verticalGardenContractAddress: {
      56: '0x81AD11FfF34D49D433596c4b9670fc65F62f65D7',
      97: '',
    },
    verticalGardenMasterGardenerPId: 25,
    verticalGardenMasterGardenerAllocPt: 15,
    stakingTokenPrice: 16,
    verticalGardenCategory: VerticalGardenCategory.PANCAKE,
    harvest: true,
    sortOrder: 5,
    isFinished: true,
    depositFee: 100, // 1%
    rewardCut: 1500, // 15%
    rewardCutSplitDevelopmentFund: 50, // 50% of 15%
    rewardCutSplitBuyPlantAndBurn: 50, // 50% of 15%
    displayOnHomePage: false,
  },
  {
    vgId: 5,
    stakingToken: tokens.banana,
    stakingRewardToken: tokens.banana,
    verticalEarningToken: tokens.plant,
    verticalGardenContractAddress: {
      56: '0x99a942EeD12fa1ae1cAe1683699D76acc533cd6a',
      97: '',
    },
    verticalGardenMasterGardenerPId: 26,
    verticalGardenMasterGardenerAllocPt: 10,
    stakingTokenPrice: 2.52,
    verticalGardenCategory: VerticalGardenCategory.COMMUNITY,
    harvest: true,
    sortOrder: 3,
    isFinished: true,
    depositFee: 100, // 1%
    rewardCut: 1500, // 15%
    rewardCutSplitDevelopmentFund: 50, // 50% of 15%
    rewardCutSplitBuyPlantAndBurn: 50, // 50% of 15%
    displayOnHomePage: false,
  },
   
]

export default verticalGardens
