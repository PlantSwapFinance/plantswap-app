import React from 'react'
import { ModalProvider, light, dark } from '@plantswap/uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import { migrateLegacyLocalStorage } from 'state/persistence/migrateLegacyStorage'

// One-shot migration: reads the legacy `redux-localstorage-simple` keys
// into the new Zustand `persist` shape. Safe to call repeatedly — it
// no-ops once the migration flag is set.
migrateLegacyLocalStorage()

const ThemeProviderWrapper = (props) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : light} {...props} />
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastsProvider>
        <HelmetProvider>
          <ThemeProviderWrapper>
            <LanguageProvider>
              <RefreshContextProvider>
                <ModalProvider>{children}</ModalProvider>
              </RefreshContextProvider>
            </LanguageProvider>
          </ThemeProviderWrapper>
        </HelmetProvider>
      </ToastsProvider>
    </Web3ReactProvider>
  )
}

export default Providers