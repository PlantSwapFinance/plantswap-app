import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export interface MintState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string // for the case when there's no liquidity
}

export const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
}

export interface TypeInputPayload {
  field: Field
  typedValue: string
  noLiquidity: boolean
}

export type MintAction =
  | { type: 'mint/resetMintState'; payload?: undefined }
  | { type: 'mint/typeInput'; payload: TypeInputPayload }

export const mintReducer = (state: MintState, action: MintAction): MintState => {
  switch (action.type) {
    case 'mint/resetMintState':
      return initialState
    case 'mint/typeInput': {
      const { field, typedValue, noLiquidity } = action.payload
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value
        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: state.typedValue,
        }
      }
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: '',
      }
    }
    default:
      return state
  }
}

export const useMintStore = create<MintState>()(
  devtools(
    () => initialState,
    { name: 'mint' },
  ),
)

export const typeInput = (payload: TypeInputPayload): void => {
  useMintStore.setState((state) => mintReducer(state, { type: 'mint/typeInput', payload }), false, 'mint/typeInput')
}

export const resetMintState = (): void => {
  useMintStore.setState((state) => mintReducer(state, { type: 'mint/resetMintState' }), false, 'mint/resetMintState')
}