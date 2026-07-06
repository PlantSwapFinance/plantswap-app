import React, { useCallback } from 'react'
import { Percent, Trade } from '@pancakeswap/sdk'

/**
 * Local swap-execution state used by the Swap and Donate views. Distinct from
 * `state/swap/store`'s `SwapState`, which is the global swap-store record.
 */
export interface SwapExecutionState {
  tradeToConfirm: Trade | undefined
  attemptingTxn: boolean
  swapErrorMessage: string | undefined
  txHash: string | undefined
}

export interface UseExecuteSwapParams {
  swapCallback: (() => Promise<string>) | null
  tradeToConfirm: Trade | undefined
  priceImpactWithoutFee: Percent | undefined
  confirmPriceImpactWithoutFee: (priceImpactWithoutFee: Percent) => Promise<boolean>
  setSwapState: React.Dispatch<React.SetStateAction<SwapExecutionState>>
}

/**
 * Encapsulates the swap-execution flow shared by the Swap and Donate views:
 *  1. If `priceImpactWithoutFee` is set, prompt the user for confirmation via
 *     `confirmPriceImpactWithoutFee` (returned by `useConfirmPriceImpactWithoutFee`).
 *  2. Run `swapCallback` and mirror the result into the view's local
 *     {@link SwapExecutionState} — `attemptingTxn` toggles around the call,
 *     `txHash` is captured on success, and the thrown error's `message` is
 *     surfaced via `swapErrorMessage`.
 *
 * `tradeToConfirm` is preserved across the lifecycle so the downstream
 * `ConfirmSwapModal` renders the same trade during the "Waiting For Confirmation"
 * view.
 *
 * Returns a stable, no-arg callback suitable for `onConfirm` of `ConfirmSwapModal`
 * and direct invocation from the Swap button in expert mode.
 */
export function useExecuteSwap({
  swapCallback,
  tradeToConfirm,
  priceImpactWithoutFee,
  confirmPriceImpactWithoutFee,
  setSwapState,
}: UseExecuteSwapParams): () => Promise<void> {
  return useCallback(async () => {
    if (priceImpactWithoutFee) {
      const ok = await confirmPriceImpactWithoutFee(priceImpactWithoutFee)
      if (!ok) return
    }
    if (!swapCallback) {
      return
    }

    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })

    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, confirmPriceImpactWithoutFee, setSwapState])
}
