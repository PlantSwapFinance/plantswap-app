import { useCallback } from 'react'
import { useConnect, useDisconnect } from 'wagmi'
import { ConnectorNames, connectorLocalStorageKey } from '@plantswap/uikit'
import { setupNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { profileClear } from 'state/profile'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { toastError } = useToast()

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectors.find((c) => {
        if (connectorID === ConnectorNames.Injected) {
          return c.id === 'injected'
        }
        if (connectorID === ConnectorNames.WalletConnect) {
          return c.id === 'walletConnect'
        }
        return false
      })

      if (connector) {
        connect({ connector }, {
          onError: async (error) => {
            // Handle unsupported chain
            if (error.message.includes('unsupported chain') || error.message.includes('chain')) {
              const hasSetup = await setupNetwork()
              if (hasSetup) {
                connect({ connector })
              }
            } else {
              window.localStorage.removeItem(connectorLocalStorageKey)
              if (error.message.includes('provider') || error.message.includes('Provider')) {
                toastError(t('Provider Error'), t('No provider was found'))
              } else if (error.message.includes('rejected') || error.message.includes('denied')) {
                toastError(t('Authorization Error'), t('Please authorize to access your account'))
              } else {
                toastError(error.name || 'Error', error.message)
              }
            }
          },
        })
      } else {
        toastError(t('Unable to find connector'), t('The connector config is wrong'))
      }
    },
    [connectors, connect, t, toastError],
  )

  const logout = useCallback(() => {
    dispatch(profileClear())
    disconnect()
    // Clear WalletConnect localStorage
    if (window.localStorage.getItem('walletconnect')) {
      window.localStorage.removeItem('walletconnect')
    }
  }, [disconnect, dispatch])

  return { login, logout }
}

export default useAuth
