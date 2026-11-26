import React, { useCallback, useState } from 'react'
import { UnsupportedChainIdError } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Button, ConnectorNames, Flex, Text } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useToast from 'hooks/useToast'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'

const Wrapper = styled(Flex)`
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
  padding: 12px 16px;
  background-color: ${({ theme }) => `${theme.colors.warning}26`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.warning};
  text-align: center;
`

/**
 * Shown when the connected wallet is on a chain PlantSwap does not support. web3-react v6 surfaces
 * this as an UnsupportedChainIdError, both when connecting and when the wallet changes chain mid-session.
 */
const WrongNetworkBanner: React.FC = () => {
  const { t } = useTranslation()
  const { error, connector, activate } = useActiveWeb3React()
  const { toastError } = useToast()
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSwitch = useCallback(async () => {
    setIsSwitching(true)
    try {
      const hasSetup = await setupNetwork()
      if (hasSetup) {
        const injected = connectorsByName[ConnectorNames.Injected]
        // Drop the wallet listeners first so re-activation does not register them twice.
        injected.deactivate()
        await activate(injected)
      } else {
        toastError(t('Wrong network'), t('Please switch your wallet to BNB Smart Chain to use PlantSwap.'))
      }
    } finally {
      setIsSwitching(false)
    }
  }, [activate, t, toastError])

  if (!(error instanceof UnsupportedChainIdError)) {
    return null
  }

  // The switch request goes through the injected provider, so it cannot help a WalletConnect session.
  const canSwitch = Boolean(window.ethereum) && !(connector instanceof WalletConnectConnector)

  return (
    <Wrapper role="alert">
      <Text bold>{t('You’re connected to an unsupported network.')}</Text>
      {canSwitch ? (
        <Button scale="sm" onClick={handleSwitch} isLoading={isSwitching} disabled={isSwitching}>
          {isSwitching ? t('Switching…') : t('Switch to BNB Smart Chain')}
        </Button>
      ) : (
        <Text>{t('Please switch your wallet to BNB Smart Chain to use PlantSwap.')}</Text>
      )}
    </Wrapper>
  )
}

export default WrongNetworkBanner
