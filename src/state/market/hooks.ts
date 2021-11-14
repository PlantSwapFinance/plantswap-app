import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { FieldNft, typeInput } from './actions'

export function useNftSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap)
}

export function useNftSwapActionHandlers(): {
  onNftSelection: (field: FieldNft, currency: string) => void
  onUserNftInput: (field: FieldNft, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onNftSelection = null

  const onUserNftInput = useCallback(
    (field: FieldNft, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  return {
    onNftSelection,
    onUserNftInput,
  }
}