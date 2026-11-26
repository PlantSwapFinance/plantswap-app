type ErrorWithCode = {
  code?: unknown
  error?: { code?: unknown }
  info?: { error?: { code?: unknown } }
}

/**
 * Detect a user rejecting a request in their wallet.
 * ethers v6 maps EIP-1193 code 4001 to `code: 'ACTION_REJECTED'`; raw providers and
 * some wallets still surface the numeric 4001, sometimes nested under `info.error` or `error`.
 */
export function isUserRejected(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as ErrorWithCode
  return (
    err.code === 'ACTION_REJECTED' || err.code === 4001 || err.info?.error?.code === 4001 || err.error?.code === 4001
  )
}

/**
 * Detect MetaMask / wallet RPC outages (Failed to fetch on eth_blockNumber, etc.).
 * These are wallet-network config problems, not usually contract reverts.
 */
export function isWalletRpcError(error: unknown): boolean {
  const message = String((error as { message?: string })?.message ?? error ?? '')
  const nested = JSON.stringify((error as { error?: unknown; info?: unknown })?.error ?? '')
  const haystack = `${message} ${nested}`.toLowerCase()

  return (
    haystack.includes('failed to fetch') ||
    haystack.includes('err_name_not_resolved') ||
    haystack.includes('could not coalesce error') ||
    haystack.includes('network error') ||
    (haystack.includes('eth_blocknumber') && haystack.includes('fetch'))
  )
}

export function getTxErrorToast(error: unknown): { title: string; description: string } {
  if (isUserRejected(error)) {
    return {
      title: 'Transaction cancelled',
      description: 'You rejected the request in your wallet. Nothing was sent.',
    }
  }

  if (isWalletRpcError(error)) {
    return {
      title: 'Wallet RPC error',
      description:
        'MetaMask could not reach the BSC network. Open MetaMask → Settings → Networks → BNB Smart Chain and set RPC URL to https://bsc-dataseed.binance.org, then retry.',
    }
  }

  return {
    title: 'Error',
    description: 'Please try again. Confirm the transaction and make sure you are paying enough gas!',
  }
}
