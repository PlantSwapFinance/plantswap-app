import { useEffect, useState, useRef, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import type { Connector } from '@web3-react/types'
import { BrowserProvider } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

/**
 * Provides a web3 provider with or without user's signer.
 * Recreate web3 instance only if the provider change.
 *
 * The codebase was originally written against @web3-react/core v6, which
 * exposed the ethers provider as `library` and bundled `activate`/`deactivate`
 * onto the context. The installed v8 splits these onto the connector and
 * renames `library` to `provider`. We mirror the v6 shape here so the rest of
 * the app keeps using `library`/`activate`/`deactivate` without churn.
 *
 * The return type is intentionally left untyped (TS-inferred) — the original
 * v6 import (`Web3ReactContextInterface` from `@web3-react/core/dist/types`)
 * no longer resolves in v8, so the migration hardcodes the shape we expose
 * instead of relying on a re-exported alias.
 */
const useActiveWeb3React = () => {
  // v8's `useWeb3React<T>()` constrains T to its v5-era BaseProvider type from
  // @ethersproject/providers; ethers v6's BrowserProvider doesn't satisfy it
  // structurally. We intentionally call the unconstrained overload and let
  // the rest of the function treat the returned provider as opaque.
  const context = useWeb3React()
  const refEth = useRef(context.provider)
  const [provider, setprovider] = useState<BrowserProvider>(
    ((context.provider as unknown as BrowserProvider | undefined) ||
      (simpleRpcProvider as unknown as BrowserProvider)),
  )

  useEffect(() => {
    if (context.provider !== refEth.current) {
      setprovider(
        (context.provider as unknown as BrowserProvider | undefined) ||
          (simpleRpcProvider as unknown as BrowserProvider),
      )
      refEth.current = context.provider
    }
  }, [context.provider])

  const activate = useCallback(
    async (connector?: Connector) => {
      const target = connector ?? context.connector
      if (!target) throw new Error('No active connector to activate')
      await target.activate()
    },
    [context.connector],
  )

  const deactivate = useCallback(() => {
    if (context.connector) {
      void context.connector.deactivate()
    }
  }, [context.connector])

  const active = Boolean(context.connector && context.chainId !== undefined && context.account !== undefined)

  return {
    connector: context.connector,
    library: provider,
    chainId: context.chainId ?? parseInt(import.meta.env.REACT_APP_CHAIN_ID, 10),
    account: context.account,
    active,
    activate,
    deactivate,
    error: undefined,
  }
}

export default useActiveWeb3React
