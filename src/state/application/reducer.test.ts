import { ChainId } from '@pancakeswap/sdk'
import { applicationReducer, ApplicationState } from './store'

describe('application reducer', () => {
  describe('updateBlockNumber', () => {
    it('updates block number', () => {
      const start: ApplicationState = { blockNumber: { [ChainId.MAINNET]: 3 } }
      const next = applicationReducer(start, { chainId: ChainId.MAINNET, blockNumber: 4 })
      expect(next.blockNumber[ChainId.MAINNET]).toEqual(4)
    })
    it('no op if late', () => {
      const start: ApplicationState = { blockNumber: { [ChainId.MAINNET]: 3 } }
      const next = applicationReducer(start, { chainId: ChainId.MAINNET, blockNumber: 2 })
      expect(next.blockNumber[ChainId.MAINNET]).toEqual(3)
    })
    it('works with non-set chains', () => {
      const start: ApplicationState = { blockNumber: { [ChainId.MAINNET]: 3 } }
      const next = applicationReducer(start, { chainId: ChainId.TESTNET, blockNumber: 2 })
      expect(next.blockNumber).toEqual({
        [ChainId.MAINNET]: 3,
        [ChainId.TESTNET]: 2,
      })
    })
  })
})