// Set of helper functions to facilitate wallet setup

import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(import.meta.env.REACT_APP_CHAIN_ID, 10)
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Binance Smart Chain Mainnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${BASE_URL}/images/tokens/${tokenAddress}.png`,
      },
    },
  })

  return tokenAdded
}

/**
 * Resolve once a browser wallet has injected `window.ethereum`, or after `timeout` ms.
 * Some wallets inject after the page scripts run and fire `ethereum#initialized` when ready.
 * @returns {boolean} true if an injected provider is available
 */
export const waitForInjectedProvider = (timeout = 3000): Promise<boolean> =>
  new Promise((resolve) => {
    if (window.ethereum) {
      resolve(true)
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const onInitialized = () => {
      clearTimeout(timer)
      window.removeEventListener('ethereum#initialized', onInitialized)
      resolve(Boolean(window.ethereum))
    }

    window.addEventListener('ethereum#initialized', onInitialized, { once: true })
    timer = setTimeout(onInitialized, timeout)
  })
