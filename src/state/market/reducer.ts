import { createReducer } from '@reduxjs/toolkit'
import { FieldNft, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'

export interface SwapState {
  readonly independentField: FieldNft
  readonly typedValue: string
  readonly [FieldNft.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [FieldNft.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
  independentField: FieldNft.INPUT,
  typedValue: '',
  [FieldNft.INPUT]: {
    currencyId: '',
  },
  [FieldNft.OUTPUT]: {
    currencyId: '',
  },
  recipient: null,
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [FieldNft.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [FieldNft.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue,
          recipient,
        }
      },
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === FieldNft.INPUT ? FieldNft.OUTPUT : FieldNft.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === FieldNft.INPUT ? FieldNft.OUTPUT : FieldNft.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      }
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === FieldNft.INPUT ? FieldNft.OUTPUT : FieldNft.INPUT,
        [FieldNft.INPUT]: { currencyId: state[FieldNft.OUTPUT].currencyId },
        [FieldNft.OUTPUT]: { currencyId: state[FieldNft.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    }),
)
