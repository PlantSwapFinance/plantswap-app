import { useEffect } from 'react'
import { consumePendingWalletConnect, trackEvent } from 'utils/analytics'
import useActiveWeb3React from './useActiveWeb3React'

/**
 * Sends `wallet_connect_success` when a connect the user started from the wallet modal
 * yields an account. Eager reconnects on page load have no pending connector and are skipped.
 */
const useTrackWalletConnect = () => {
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (!account) return
    const connector = consumePendingWalletConnect()
    if (connector) {
      trackEvent('wallet_connect_success', { connector })
    }
  }, [account])
}

export default useTrackWalletConnect
