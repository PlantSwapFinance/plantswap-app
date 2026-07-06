import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

export const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: null,
}

// Action payload shapes — kept identical to the original createAction types so
// external callers don't need to change.
export interface SelectCurrencyPayload {
  field: Field
  currencyId: string
}
export interface TypeInputPayload {
  field: Field
  typedValue: string
}
export interface ReplaceSwapStatePayload {
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}
export interface SetRecipientPayload {
  recipient: string | null
}

/**
 * Pure reducer for the swap slice. Behaviour mirrors the original
 * `createReducer` exactly — every case returns a new state object so
 * consumers can rely on referential change detection.
 *
 * NOTE: This reducer is also used by the NFT swap in `state/market/`.
 * Both `Field.INPUT`/`Field.OUTPUT` and `FieldNft.INPUT`/`FieldNft.OUTPUT`
 * resolve to the same string values, and both pre-migration slices wrote
 * to the same `state.swap` Redux key. Preserving that shared-state
 * behaviour: the reducer is field-type-agnostic and only cares about the
 * enum's underlying string values.
 */
export const swapReducer = (state: SwapState, action: SwapAction): SwapState => {
  switch (action.type) {
    case 'swap/replaceSwapState': {
      const { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } = action.payload
      return {
        [Field.INPUT]: { currencyId: inputCurrencyId },
        [Field.OUTPUT]: { currencyId: outputCurrencyId },
        independentField: field,
        typedValue,
        recipient,
      }
    }
    case 'swap/selectCurrency': {
      const { currencyId, field } = action.payload
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      }
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      }
    }
    case 'swap/switchCurrencies': {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    }
    case 'swap/typeInput': {
      const { field, typedValue } = action.payload
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    }
    case 'swap/setRecipient': {
      const { recipient } = action.payload
      return { ...state, recipient }
    }
    default:
      return state
  }
}

export type SwapAction =
  | { type: 'swap/selectCurrency'; payload: SelectCurrencyPayload }
  | { type: 'swap/switchCurrencies'; payload?: undefined }
  | { type: 'swap/typeInput'; payload: TypeInputPayload }
  | { type: 'swap/replaceSwapState'; payload: ReplaceSwapStatePayload }
  | { type: 'swap/setRecipient'; payload: SetRecipientPayload }

export const useSwapStore = create<SwapState>()(
  devtools(
    () => initialState,
    { name: 'swap' },
  ),
)

// Action functions — exported as standalone functions so callers can do
// `import { selectCurrency } from 'state/swap'` and invoke directly.

export const selectCurrency = (payload: SelectCurrencyPayload): void => {
  useSwapStore.setState((state) => swapReducer(state, { type: 'swap/selectCurrency', payload }), false, 'swap/selectCurrency')
}

export const switchCurrencies = (): void => {
  useSwapStore.setState((state) => swapReducer(state, { type: 'swap/switchCurrencies' }), false, 'swap/switchCurrencies')
}

export const typeInput = (payload: TypeInputPayload): void => {
  useSwapStore.setState((state) => swapReducer(state, { type: 'swap/typeInput', payload }), false, 'swap/typeInput')
}

export const replaceSwapState = (payload: ReplaceSwapStatePayload): void => {
  useSwapStore.setState(
    (state) => swapReducer(state, { type: 'swap/replaceSwapState', payload }),
    false,
    'swap/replaceSwapState',
  )
}

export const setRecipient = (payload: SetRecipientPayload): void => {
  useSwapStore.setState((state) => swapReducer(state, { type: 'swap/setRecipient', payload }), false, 'swap/setRecipient')
}