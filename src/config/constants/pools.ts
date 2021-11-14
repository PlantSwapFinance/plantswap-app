import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    stakingToken: tokens.plant,
    earningToken: tokens.plant,
    contractAddress: {
      56: '0xEe60b364586B91945a7521C025c09a5E72832f4f',
      97: '',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 1,
    tokenPerBlock: '0.003',
  },
  {
    sousId: 2,
    stakingToken: tokens.busd,
    earningToken: tokens.plant,
    contractAddress: {
      56: '0x6E93982FFBfD12Fa029Ededa13D96d02DB5eB130',
      97: '',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 2,
    tokenPerBlock: '0.002',
  },
  {
    sousId: 3,
    stakingToken: tokens.cake,
    earningToken: tokens.plant,
    contractAddress: {
      56: '0xDF9ED26b847dFC66884909E73197f56A9a0A3482',
      97: '',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 3,
    tokenPerBlock: '0.002',
  },
]

export default pools
