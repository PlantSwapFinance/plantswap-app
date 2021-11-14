import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  
  {
    pid: 0,
    risk: 5,
    lpSymbol: 'PLANT',
    lpAddresses: tokens.plant.address,
    isTokenOnly: true,
    token: tokens.plant,
    quoteToken: tokens.plant,
    rewardToken: tokens.plant,
  },
  {
    pid: 28,
    risk: 5,
    lpSymbol: 'BNB/BUSD',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    isTokenOnly: false,
    isOnlyForBackground: true,
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 29,
    risk: 5,
    lpSymbol: 'CAKE/BNB',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    isTokenOnly: false,
    isOnlyForBackground: true,
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  // New V2
  {
    pid: 4,
    risk: 5,
    lpSymbol: 'PLANT-BNB LP V2',
    lpAddresses: {
      97: '',
      56: '0x79268898de0f8c67ad73d9e33534d9874411aaaa',
    },
    isTokenOnly: false,
    token: tokens.plant,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 5,
    risk: 5,
    lpSymbol: 'PLANT-BUSD LP V2',
    lpAddresses: {
      97: '',
      56: '0xdf638da5adff2c7fdb2ce0fbbfa15813fa113aaa',
    },
    isTokenOnly: false,
    token: tokens.plant,
    quoteToken: tokens.busd,
  },
  {
    pid: 11,
    risk: 5,
    lpSymbol: 'PLANT-USDC LP V2',
    lpAddresses: {
      97: '',
      56: '0xb8b41534d152fd1c22102925b3e213d91840c277',
    },
    isTokenOnly: false,
    token: tokens.plant,
    quoteToken: tokens.usdc,
  },
  {
    pid: 12,
    risk: 5,
    lpSymbol: 'PLANT-CAKE LP V2',
    lpAddresses: {
      97: '',
      56: '0x6280DcC6d8aD8ed0c046f2d65ee22377398f5Fa7',
    },
    isTokenOnly: false,
    token: tokens.plant,
    quoteToken: tokens.cake,
  },
  // V1 (Not to use anymore)
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'PLANT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd0dc9cc35ed1584f4858e5194bd9b153b70b8a83',
    },
    isTokenOnly: false,
    token: tokens.plant,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 3,
    risk: 5,
    lpSymbol: 'PLANT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xf71070df7c352a2668266703dc5d3d539d336bb0',
    },
    isTokenOnly: false,
    token: tokens.plant,
    quoteToken: tokens.busd,
  },
  {
    pid: 7,
    risk: 3,
    lpSymbol: 'BUSD',
    lpAddresses: tokens.busd.address,
    isTokenOnly: true,
    depositFee: 100,
    token: tokens.busd,
    quoteToken: tokens.busd,
    rewardToken: tokens.plant,
  },
  {
    pid: 9,
    risk: 2,
    lpSymbol: 'USDC',
    lpAddresses: tokens.usdc.address,
    isTokenOnly: true,
    depositFee: 100,
    token: tokens.usdc,
    quoteToken: tokens.usdc,
    rewardToken: tokens.plant,
  },
  {
    pid: 10,
    risk: 3,
    lpSymbol: 'CAKE',
    lpAddresses: tokens.cake.address,
    isTokenOnly: true,
    depositFee: 100,
    token: tokens.cake,
    quoteToken: tokens.cake,
    rewardToken: tokens.plant,
  },
]

export default farms
