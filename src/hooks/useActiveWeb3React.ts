import { useEffect, useState, useRef, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import type { Connector } from '@web3-react/types'
import { BrowserProvider } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

/**
 * Provides a web3 provider with or without user's signer.
 * Recreate web3 instance only if the provider changes.
 *
 * Written against @web3-react/core v6, which exposes:
 *   - `library` (the ethers provider from `getLibrary`)
 *   - `activate(connector, errorCallback?)` / `deactivate()` on the context
 *   - `active` flag computed from chainId + account
 *
 * The connector packages (`@web3-react/injected-connector`,
 * `@web3-react/walletconnect-connector`) are on v6 as well — keeping the
 * core package on v6 is what makes the `activate(connector, …)` call sites
 * in `useAuth` and friends type- and runtime-compatible.
 *
 * The return type is intentionally left untyped (TS-inferred): the original
 * v6 `Web3ReactContextInterface` import path no longer resolves cleanly with
 * the current dependency graph, so we hardcode the shape we expose.
 */
const useActiveWeb3React = () => {
  const context = useWeb3React()
  const refEth = useRef(context.library)
  const [provider, setProvider] = useState<BrowserProvider>(
    ((context.library as unknown as BrowserProvider | undefined) ||
      (simpleRpcProvider as unknown as BrowserProvider)),
  )

  useEffect(() => {
    if (context.library !== refEth.current) {
      setProvider(
        (context.library as unknown as BrowserProvider | undefined) ||
          (simpleRpcProvider as unknown as BrowserProvider),
      )
      refEth.current = context.library
    }
  }, [context.library])

  const activate = useCallback(
    async (connector?: Connector, callback?: (error: Error) => void) => {
      const target = connector ?? context.connector
      if (!target) throw new Error('No active connector to activate')
      await context.activate(target, callback)
    },
    [context],
  )

  const deactivate = useCallback(() => {
    void context.deactivate()
  }, [context])

  const active = Boolean(context.active)

  return {
    connector: context.connector,
    library: provider,
    chainId: context.chainId ?? parseInt(import.meta.env.REACT_APP_CHAIN_ID, 10),
    account: context.account ?? undefined,
    active,
    activate,
    deactivate,
    error: context.error,
  }
}

export default useActiveWeb3React
