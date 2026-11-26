// Set of helper functions to facilitate wallet setup

import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { nodes } from './getRpcUrl'

// EIP-3326: the wallet does not know the requested chain yet. Some mobile wallets nest the code.
const UNRECOGNIZED_CHAIN_ERROR_CODE = 4902

const isUnrecognizedChainError = (error: any) =>
  error?.code === UNRECOGNIZED_CHAIN_ERROR_CODE || error?.data?.originalError?.code === UNRECOGNIZED_CHAIN_ERROR_CODE

/**
 * Ask the wallet to switch to BSC, and add BSC to the wallet first if it does not know the chain yet
 * @returns {boolean} true if the wallet is now on BSC, false if the user refused or the wallet failed
 */
export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(import.meta.env.REACT_APP_CHAIN_ID, 10)
    const hexChainId = `0x${chainId.toString(16)}`
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
      return true
    } catch (switchError) {
      if (!isUnrecognizedChainError(switchError)) {
        console.error('Failed to switch the wallet network:', switchError)
        return false
      }
    }
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: hexChainId,
            chainName: 'BNB Smart Chain',
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
      console.error('Failed to add the network to the wallet:', error)
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
