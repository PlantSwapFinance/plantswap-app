import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@plantswap/uikit'
import { BrowserProvider } from 'ethers'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(import.meta.env.REACT_APP_CHAIN_ID, 10)

const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://plantswap.bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

// const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: null, // bscConnector
}

export const getLibrary = (provider: any): BrowserProvider => {
  const library = new BrowserProvider(provider)
  // BrowserProvider exposes polling via `provider.pollingInterval` (still mutable in v6).
  library.pollingInterval = POLLING_INTERVAL
  return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (provider: any, account: string, message: string): Promise<string> => {
  if (window.BinanceChain) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * ethers v6: `getSigner` is async. `JsonRpcSigner.signMessage` sends `personal_sign` with the
   * hex-encoded UTF-8 message, which is also what WalletConnect expects
   * (@see https://github.com/WalletConnect/walletconnect-monorepo/issues/462), so no WC-specific path is needed.
   */
  const signer = await provider.getSigner(account)
  return signer.signMessage(message)
}
