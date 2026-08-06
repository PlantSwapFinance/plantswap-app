import React, { useMemo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-host the Kanit font.
import '@fontsource/kanit/400.css'
import '@fontsource/kanit/600.css'
// Polyfill Buffer on globalThis so bn.js and @pancakeswap/sdk can read it.
import { Buffer } from 'buffer'
import useActiveWeb3React from './hooks/useActiveWeb3React'
import { BLOCKED_ADDRESSES } from './config/constants'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import App from './App'
import Providers from './Providers'

;(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useActiveWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked address</div>
  }
  return <>{children}</>
}

const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)
root.render(
  <React.StrictMode>
    <Providers>
      <Blocklist>
        <Updaters />
        <App />
      </Blocklist>
    </Providers>
  </React.StrictMode>,
)
