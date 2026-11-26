import { useCallback } from 'react'
import { UnsupportedChainIdError } from '@web3-react/core'
// import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from '@plantswap/uikit'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { profileClear } from 'state/profile/store'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from './useActiveWeb3React'

const useAuth = () => {
  const { t } = useTranslation()
  const { activate, deactivate } = useActiveWeb3React()
  const { toastError } = useToast()

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            } else {
              toastError(t('Wrong network'), t('Please switch your wallet to BNB Smart Chain to use PlantSwap.'))
              if (connector instanceof InjectedConnector) {
                // Activate without an error callback so web3-react keeps the connector in its
                // UnsupportedChainIdError state: the wrong-network banner shows, and switching
                // chain from the wallet later recovers the session automatically. Deactivating
                // first drops the wallet listeners so re-activation does not register them twice.
                connector.deactivate()
                activate(connector)
              }
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError) {
              // || error instanceof NoBscProviderError
              toastError(
                t('No wallet detected'),
                t('Install a browser wallet such as MetaMask, or open PlantSwap in your wallet app’s browser.'),
              )
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector
                walletConnector.walletConnectProvider = null
              }
              toastError(t('Authorization Error'), t('Please authorize to access your wallet'))
            } else {
              toastError(error.name, error.message)
            }
          }
        })
      } else {
        toastError(t('Wallet not supported'), t('This wallet option is not available. Please choose another wallet.'))
      }
    },
    [t, activate, toastError],
  )

  const logout = useCallback(() => {
    profileClear()
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = null
    }
  }, [deactivate])

  return { login, logout }
}

export default useAuth
