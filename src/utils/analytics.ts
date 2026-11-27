import { isUserRejected } from 'utils/txError'

/**
 * Funnel analytics: per-step events sent to the Google tag loaded in index.html,
 * so drop-off between connect -> approve -> get LP -> stake can be measured.
 *
 * Events are fire-and-forget: when gtag is missing (ad blockers, local dev without
 * REACT_APP_GTAG, tests) or throws, tracking is silently skipped and never breaks a flow.
 */

export type FunnelEvent =
  | 'wallet_connect_click'
  | 'wallet_connect_attempt'
  | 'wallet_connect_success'
  | 'wallet_connect_error'
  | 'approve_start'
  | 'approve_success'
  | 'approve_error'
  | 'get_lp_click'
  | 'add_liquidity_start'
  | 'add_liquidity_submitted'
  | 'add_liquidity_error'
  | 'stake_start'
  | 'stake_success'
  | 'stake_error'

export type FunnelEventParams = Record<string, string | number | boolean | undefined>

type Gtag = (command: 'event', eventName: string, params?: FunnelEventParams) => void

export const trackEvent = (event: FunnelEvent, params: FunnelEventParams = {}): void => {
  if (typeof window === 'undefined') return
  const { gtag } = window as unknown as { gtag?: Gtag }
  if (typeof gtag !== 'function') return
  try {
    gtag('event', event, { event_category: 'funnel', ...params })
  } catch {
    // Analytics must never interrupt the user's flow.
  }
}

/** Short, low-cardinality reason for an error event (no messages, addresses or amounts). */
export const getErrorReason = (error: unknown): string => {
  if (isUserRejected(error)) return 'user_rejected'
  const name = error && typeof error === 'object' ? (error as { name?: unknown }).name : undefined
  if (typeof name === 'string' && name) return name
  return 'unknown'
}

// The connector a user picked in the connect modal, until the wallet reports an account.
// Lets `wallet_connect_success` be told apart from silent eager reconnects on page load.
let pendingConnector: string | null = null

export const setPendingWalletConnect = (connector: string | null): void => {
  pendingConnector = connector
}

export const consumePendingWalletConnect = (): string | null => {
  const connector = pendingConnector
  pendingConnector = null
  return connector
}
