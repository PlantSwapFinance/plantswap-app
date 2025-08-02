import { useEffect, useState, useRef } from 'react'
import { useAccount, useChainId, useConnectorClient } from 'wagmi'
import { Web3Provider } from '@ethersproject/providers'
import { simpleRpcProvider } from 'utils/providers'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: connectorClient } = useConnectorClient()
  
  const refEth = useRef(connectorClient)
  const [provider, setProvider] = useState(connectorClient || simpleRpcProvider)

  useEffect(() => {
    if (connectorClient !== refEth.current) {
      setProvider(connectorClient || simpleRpcProvider)
      refEth.current = connectorClient
    }
  }, [connectorClient])

  return { 
    library: provider, 
    chainId: chainId ?? parseInt(process.env.REACT_APP_CHAIN_ID, 10), 
    account: address,
    active: isConnected,
    connector: connectorClient,
  }
}

export default useActiveWeb3React
