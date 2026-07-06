import { Field, initialState, swapReducer } from './store'
import { SwapState } from './store'

describe('swap reducer', () => {
  describe('selectToken', () => {
    it('changes token', () => {
      const start: SwapState = {
        ...initialState,
      }
      const next = swapReducer(start, {
        type: 'swap/selectCurrency',
        payload: { field: Field.OUTPUT, currencyId: '0x0000' },
      })

      expect(next).toEqual({
        [Field.OUTPUT]: { currencyId: '0x0000' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null,
      })
    })
  })
})