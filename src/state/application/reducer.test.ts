import { ChainId } from '@pancakeswap/sdk'
import { applicationReducer, ApplicationState } from './store'

describe('application reducer', () => {
  describe('updateBlockNumber', () => {
    it('updates block number', () => {
      const start: ApplicationState = { blockNumber: { [ChainId.BSC]: 3 } }
      const next = applicationReducer(start, { chainId: ChainId.BSC, blockNumber: 4 })
      expect(next.blockNumber[ChainId.BSC]).toEqual(4)
    })
    it('no op if late', () => {
      const start: ApplicationState = { blockNumber: { [ChainId.BSC]: 3 } }
      const next = applicationReducer(start, { chainId: ChainId.BSC, blockNumber: 2 })
      expect(next.blockNumber[ChainId.BSC]).toEqual(3)
    })
    it('works with non-set chains', () => {
      const start: ApplicationState = { blockNumber: { [ChainId.BSC]: 3 } }
      const next = applicationReducer(start, { chainId: ChainId.BSC_TESTNET, blockNumber: 2 })
      expect(next.blockNumber).toEqual({
        [ChainId.BSC]: 3,
        [ChainId.BSC_TESTNET]: 2,
      })
    })
  })
})