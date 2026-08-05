import React, { useMemo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
// Pin `jsxDEV` to a real local binding and re-expose it on
// `globalThis` before any other module evaluates. `@plantswap/uikit@1.0.1`
// references `jsxDEV` at the top of its `index.esm.js`
// (`const DefaultSeparator = jsxDEV(Icon$39, ...)`) and Vite 8's
// rolldown bundler splits that into smaller chunks. When the chunk
// that *calls* `jsxDEV(...)` lands before the chunk that binds the
// `jsxDEV` import, the call resolves to `undefined` and the page
// white-screens with `(0, H.jsxDEV) is not a function`. Importing
// it here (above every other import) forces the binding to be
// evaluated first, and exposing it on `globalThis` is a belt-and-
// suspenders fallback for any chunk that still tries to resolve
// `jsxDEV` through a hoisted global.
import { jsxDEV as _jsxDEV } from 'react/jsx-dev-runtime'
;(globalThis as unknown as { jsxDEV: typeof _jsxDEV }).jsxDEV = _jsxDEV
// Self-host the Kanit font used across the app — avoids the
// render-blocking CSS fetch from fonts.googleapis.com.
import '@fontsource/kanit/400.css'
import '@fontsource/kanit/600.css'
// Polyfill `Buffer` on `globalThis` so libraries like `bn.js` and
// `@pancakeswap/sdk` that defensively read `buffer.Buffer` don't get
// Vite's `Module "buffer" has been externalized … Cannot access
// "buffer.Buffer" in client code` warning.
import { Buffer } from 'buffer'
// Install `window.onerror` / `onunhandledrejection` loggers so async
// exceptions that escape React's render path still surface in the
// console instead of white-screening silently.
import installGlobalErrorHandlers from './handlers/installGlobalErrorHandlers'
import useActiveWeb3React from './hooks/useActiveWeb3React'
import { BLOCKED_ADDRESSES } from './config/constants'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import App from './App'
import Providers from './Providers'
import ErrorBoundary from './components/ErrorBoundary'

// All side effects must run AFTER every import above has resolved.
// Putting them between imports caused Vite 8's rolldown bundler to
// misorder module evaluation, which made `react/jsx-dev-runtime`'s
// `jsxDEV` export arrive `undefined` when the very first JSX expression
// in this file ran (`<React.StrictMode>...`). Result: a white page
// with `(0, H.jsxDEV) is not a function` at module-evaluation time,
// raised inside `@plantswap/uikit@1.0.1`'s top-level
// `const DefaultSeparator = jsxDEV(Icon$39, ...)` call. The import at
// the top of this file pins `jsxDEV` to a real local binding before
// anything else evaluates, so the call site can never see `undefined`.
;(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
installGlobalErrorHandlers()

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
    {/* Catch any render-time throw and surface a readable fallback
        instead of a white page. Sits inside StrictMode so the boundary
        itself isn't double-invoked in dev. */}
    <ErrorBoundary>
      <Providers>
        <Blocklist>
          <Updaters />
          <App />
        </Blocklist>
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>,
)
