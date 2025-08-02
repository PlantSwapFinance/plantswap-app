import { useEffect, useState, useRef } from 'react'
import { useAccount, useChainId, useWalletClient } from 'wagmi'
import { Web3Provider } from '@ethersproject/providers'
import { providers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()

  // Build an ethers.js Web3Provider whenever wagmi gives us a walletClient
  const ethersProvider: Web3Provider | providers.JsonRpcProvider = walletClient
    ? new Web3Provider(walletClient.transport as any, 'any')
    : simpleRpcProvider

  const refEth = useRef(ethersProvider)
  const [provider, setProvider] = useState<typeof ethersProvider>(ethersProvider)

  useEffect(() => {
    if (ethersProvider !== refEth.current) {
      setProvider(ethersProvider)
      refEth.current = ethersProvider
    }
  }, [ethersProvider])

  return {
    library: provider as Web3Provider,
    chainId: chainId ?? parseInt(process.env.REACT_APP_CHAIN_ID, 10),
    account: address,
    active: isConnected,
    connector: walletClient,
  }
}

export default useActiveWeb3React
