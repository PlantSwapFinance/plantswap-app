import { Field, initialState, mintReducer } from './store'
import { MintState } from './store'

describe('mint reducer', () => {
  describe('typeInput', () => {
    it('sets typed value', () => {
      const start: MintState = { ...initialState }
      const next = mintReducer(start, {
        type: 'mint/typeInput',
        payload: { field: Field.CURRENCY_A, typedValue: '1.0', noLiquidity: false },
      })
      expect(next).toEqual({ independentField: Field.CURRENCY_A, typedValue: '1.0', otherTypedValue: '' })
    })

    it('clears other value', () => {
      const start: MintState = { ...initialState }
      const after1 = mintReducer(start, {
        type: 'mint/typeInput',
        payload: { field: Field.CURRENCY_A, typedValue: '1.0', noLiquidity: false },
      })
      const after2 = mintReducer(after1, {
        type: 'mint/typeInput',
        payload: { field: Field.CURRENCY_B, typedValue: '1.0', noLiquidity: false },
      })
      expect(after2).toEqual({ independentField: Field.CURRENCY_B, typedValue: '1.0', otherTypedValue: '' })
    })
  })
})