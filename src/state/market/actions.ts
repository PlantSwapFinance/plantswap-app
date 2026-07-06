/**
 * NFT swap action surface — historically registered with type strings
 * `'swap/...'` so they shared Redux state with the regular swap. After
 * the Zustand migration both flows write to the same `useSwapStore` to
 * preserve that legacy shared-state behaviour.
 *
 * The `FieldNft` enum mirrors `Field` (same string values); consumers
 * continue to import it from this module so the import path is unchanged.
 */

import {
  Field,
  selectCurrency as swapSelectCurrency,
  switchCurrencies as swapSwitchCurrencies,
  typeInput as swapTypeInput,
  replaceSwapState as swapReplaceSwapState,
  setRecipient as swapSetRecipient,
} from '../swap/store'

export enum FieldNft {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

// `FieldNft` and `Field` resolve to the same string values; the legacy code
// relied on this to share state across slices.
const toField = (field: FieldNft): Field => field as unknown as Field

export const selectCurrency = (payload: { field: FieldNft; currencyId: string }): void => {
  swapSelectCurrency({ field: toField(payload.field), currencyId: payload.currencyId })
}

export const switchCurrencies = (): void => {
  swapSwitchCurrencies()
}

export const typeInput = (payload: { field: FieldNft; typedValue: string }): void => {
  swapTypeInput({ field: toField(payload.field), typedValue: payload.typedValue })
}

export const replaceSwapState = (payload: {
  field: FieldNft
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}): void => {
  swapReplaceSwapState({
    field: toField(payload.field),
    typedValue: payload.typedValue,
    inputCurrencyId: payload.inputCurrencyId,
    outputCurrencyId: payload.outputCurrencyId,
    recipient: payload.recipient,
  })
}

export const setRecipient = (payload: { recipient: string | null }): void => {
  swapSetRecipient(payload)
}