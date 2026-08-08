import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary, ModalProvider, light, dark } from '@plantswap/uikit'
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

const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ToastsProvider>
          <HelmetProvider>
            <ThemeProviderWrapper>
              <LanguageProvider>
                <RefreshContextProvider>
                  {/*
                    Wrap ModalProvider so portal-rendered modals are covered.
                    RouteErrorBoundary only wraps route children, so stake/deposit
                    modal crashes otherwise white-screen the whole app.
                  */}
                  <ErrorBoundary
                    onError={(error, errorInfo) => {
                      console.error('App render error', error, errorInfo)
                    }}
                  >
                    <ModalProvider>{children}</ModalProvider>
                  </ErrorBoundary>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeProviderWrapper>
          </HelmetProvider>
        </ToastsProvider>
      </Web3ReactProvider>
    </BrowserRouter>
  )
}

export default Providers