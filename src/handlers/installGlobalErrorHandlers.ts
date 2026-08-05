// Install process-wide handlers for unhandled errors so the page never
// silently white-screens on:
//
//   - window.onerror — synchronous JS exceptions that escape React's
//     render path (e.g. an error inside an event handler, or a bug in
//     a chunk-load).
//   - window.onunhandledrejection — async exceptions that no one caught
//     (e.g. a `fetch().json()` call after the dev backend returned an
//     HTML 404 page).
//
// We log to console so they still show up in DevTools, then re-throw to
// preserve the existing behaviour (some setups surface them via their
// own error reporter).

export default function installGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return

  const previousOnError = window.onerror
  window.onerror = function onError(message, source, lineno, colno, error) {
    // eslint-disable-next-line no-console
    console.error('[window.onerror]', { message, source, lineno, colno, error })
    if (typeof previousOnError === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (previousOnError as any).apply(this, arguments as any)
    }
    // Returning false lets the browser's default handler still run.
    return false
  }

  const previousOnRejection = window.onunhandledrejection
  window.onunhandledrejection = function onRejection(event: PromiseRejectionEvent) {
    // eslint-disable-next-line no-console
    console.error('[window.onunhandledrejection]', event.reason)
    if (typeof previousOnRejection === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (previousOnRejection as any).call(window, event)
    }
  }
}
