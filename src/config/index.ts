import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

// PLANT_PER_BLOCK details
// 0.02 PLANT is minted per block
// 1% PLANT per block is sent to Burn pool (A farm just for burning plant)
// PLANT_PER_BLOCK in config/index.ts = 0.02 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/PlantDataRow.tsx = 19 (40 - Amount sent to burn pool)
export const PLANT_PER_BLOCK = new BigNumber(0.02)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const CAKE_PER_BLOCK = PLANT_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BASE_URL = 'https://plantswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_URL}/pool`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000
export const COLLECTIBLESFARM_GAS_LIMIT = 500000
export const VERTICALGARDEN_GAS_LIMIT = 950000
export const DEFAULT_GAS_PRICE = 5
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500

// Allow Main MasterGardener and Opperation to see the in dev part of the frontend
export const MASTERGARDENERDEVADDRESS = '0x54195fd92Ce010B4273A5948A1061b40Dd944De4' || '0x48Ed3104659C4ae85Ca655Bb37B1E6737ADc67B3'