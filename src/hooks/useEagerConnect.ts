import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@plantswap/uikit'
import useAuth from 'hooks/useAuth'
import { waitForInjectedProvider } from 'utils/wallet'

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId))

        return
      }

      // Browser wallets can inject `window.ethereum` after the app boots. Wait for it,
      // and if no wallet shows up (e.g. extension removed or disabled), forget the saved
      // connector quietly instead of showing a "No provider was found" error on page load.
      if (connectorId === ConnectorNames.Injected && !window.ethereum) {
        waitForInjectedProvider().then((hasProvider) => {
          if (hasProvider) {
            login(connectorId)
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey)
          }
        })

        return
      }

      login(connectorId)
    }
  }, [login])
}

export default useEagerConnect
