import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export enum Field {
  LIQUIDITY_PERCENT = 'LIQUIDITY_PERCENT',
  LIQUIDITY = 'LIQUIDITY',
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export interface BurnState {
  readonly independentField: Field
  readonly typedValue: string
}

export const initialState: BurnState = {
  independentField: Field.LIQUIDITY_PERCENT,
  typedValue: '0',
}

export interface TypeInputPayload {
  field: Field
  typedValue: string
}

export type BurnAction = { type: 'burn/typeInput'; payload: TypeInputPayload }

export const burnReducer = (state: BurnState, action: BurnAction): BurnState => {
  switch (action.type) {
    case 'burn/typeInput': {
      const { field, typedValue } = action.payload
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    }
    default:
      return state
  }
}

export const useBurnStore = create<BurnState>()(
  devtools(
    () => initialState,
    { name: 'burn' },
  ),
)

export const typeInput = (payload: TypeInputPayload): void => {
  useBurnStore.setState((state) => burnReducer(state, { type: 'burn/typeInput', payload }), false, 'burn/typeInput')
}