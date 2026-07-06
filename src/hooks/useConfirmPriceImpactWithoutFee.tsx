import React, { useCallback, useRef, useState } from 'react'
import { Percent } from '@pancakeswap/sdk'

import ConfirmPriceImpactModal from 'components/ConfirmPriceImpactModal'
import { ALLOWED_PRICE_IMPACT_HIGH } from 'config/constants'

/**
 * Replaces `utils/confirmPriceImpactWithoutFee`'s native `window.prompt` / `window.confirm`
 * with a styled in-app modal. Returns the JSX node to render and a Promise-returning
 * confirm function:
 *
 *   const [priceImpactModal, confirmPriceImpactWithoutFee] = useConfirmPriceImpactWithoutFee()
 *   const ok = await confirmPriceImpactWithoutFee(priceImpactWithoutFee)
 *   if (!ok) return
 *   // ...render {priceImpactModal} somewhere in the tree
 *
 * Sub-5% impact resolves immediately (no modal). 5-10% shows a simple confirm modal;
 * >=10% shows a typed-confirm modal.
 *
 * NOT implemented via `useModal` from `@plantswap/uikit`: `ModalProvider` is a single global
 * slot, and the parent views already open `ConfirmSwapModal` via `useModal`. Using `useModal`
 * here would tear down `ConfirmSwapModal` mid-flow and lose the "Waiting For Confirmation" view.
 */
export default function useConfirmPriceImpactWithoutFee(): [
  React.ReactNode,
  (priceImpactWithoutFee: Percent) => Promise<boolean>,
] {
  const [pendingImpact, setPendingImpact] = useState<Percent | null>(null)
  const resolverRef = useRef<((ok: boolean) => void) | null>(null)

  const resolveAndClose = useCallback((ok: boolean) => {
    const resolve = resolverRef.current
    resolverRef.current = null
    setPendingImpact(null)
    if (resolve) resolve(ok)
  }, [])

  const handleConfirm = useCallback(() => resolveAndClose(true), [resolveAndClose])
  const handleDismiss = useCallback(() => resolveAndClose(false), [resolveAndClose])

  const confirmPriceImpactWithoutFee = useCallback(
    (priceImpactWithoutFee: Percent): Promise<boolean> => {
      // Below the simple-confirm threshold: no prompt, matches the original behavior.
      if (priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
        return Promise.resolve(true)
      }
      // Re-entry guard: if a confirmation is already in flight, abort the second call
      // by resolving false. Matches the prior behavior where a second Swap click was
      // silently ignored (the Swap button is only disabled after `attemptingTxn: true`).
      if (resolverRef.current !== null) {
        return Promise.resolve(false)
      }
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
        setPendingImpact(priceImpactWithoutFee)
      })
    },
    [],
  )

  const priceImpactModal =
    pendingImpact !== null ? (
      <ConfirmPriceImpactModal
        priceImpactWithoutFee={pendingImpact}
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
      />
    ) : null

  return [priceImpactModal, confirmPriceImpactWithoutFee]
}