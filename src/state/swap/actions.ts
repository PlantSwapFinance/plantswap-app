/**
 * Re-export of swap action types and creators for backwards compatibility.
 *
 * The original `createAction` creators lived here. After the Zustand
 * migration they have been replaced by direct store mutations in
 * `./store`. This module now re-exports the canonical action surface so
 * existing imports (`import { Field, selectCurrency } from 'state/swap/actions'`)
 * continue to work — the action creators are no-ops that simply call the
 * equivalent Zustand action.
 */

export { Field, selectCurrency, switchCurrencies, typeInput, replaceSwapState, setRecipient } from './store'