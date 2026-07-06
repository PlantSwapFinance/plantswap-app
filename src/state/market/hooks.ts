/**
 * NFT swap hooks — share state with the regular swap via the same
 * `useSwapStore`. Preserves the pre-migration behaviour where both flows
 * wrote to `state.swap` in Redux.
 */

import { useCallback } from 'react'
import { FieldNft, typeInput } from './actions'
import { SwapState, useSwapStore } from '../swap/store'

export function useNftSwapState(): SwapState {
  return useSwapStore()
}

export function useNftSwapActionHandlers(): {
  onNftSelection: (field: FieldNft, currency: string) => void
  onUserNftInput: (field: FieldNft, typedValue: string) => void
} {
  const onNftSelection = null

  const onUserNftInput = useCallback((field: FieldNft, typedValue: string) => {
    typeInput({ field, typedValue })
  }, [])

  return {
    onNftSelection,
    onUserNftInput,
  }
}