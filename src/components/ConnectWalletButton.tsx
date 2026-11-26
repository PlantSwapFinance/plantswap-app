import React from 'react'
import { Button, useWalletModal } from '@plantswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { trackEvent } from 'utils/analytics'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  const handleClick = () => {
    trackEvent('wallet_connect_click', { page_path: window.location.pathname })
    onPresentConnectModal()
  }

  return (
    <Button onClick={handleClick} {...props}>
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
