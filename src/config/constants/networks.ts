import type { Currency } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/sdk'
const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.BSC]: 'https://bsc-dataseed1.defibit.io',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
}

export default NETWORK_URLS
