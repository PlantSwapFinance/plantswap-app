import React, { Suspense, SuspenseProps } from 'react'

interface State {
  error: Error | null
}

// Vite surfaces failed lazy imports as a TypeError whose message differs per browser.
const DYNAMIC_IMPORT_ERROR =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i

const isChunkLoadError = (error): boolean =>
  error?.name === 'ChunkLoadError' ||
  error?.code === 'CSS_CHUNK_LOAD_FAILED' ||
  DYNAMIC_IMPORT_ERROR.test(error?.message ?? '')

// A flag in history state prevents infinite reloads when the chunk is genuinely gone.
const isRecoveringFromChunkError = (): boolean => !!window.history.state?.isRecoveringFromChunkError

/**
 * Suspense that reloads the page once when a lazy chunk fails to load (e.g. after a deploy).
 * Every other error is rethrown during render so the parent RouteErrorBoundary shows its fallback.
 */
class SuspenseWithChunkError extends React.Component<SuspenseProps, State> {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    if (isChunkLoadError(error) && !isRecoveringFromChunkError()) {
      const nextState = { ...window.history.state, isRecoveringFromChunkError: true }
      window.history.replaceState(nextState, '')
      window.location.reload()
    }
  }

  render() {
    const { error } = this.state
    const { fallback } = this.props

    if (error) {
      // Keep the loader up while the page reloads; anything else goes to the route boundary.
      if (isChunkLoadError(error) && !isRecoveringFromChunkError()) {
        return fallback
      }
      throw error
    }

    return <Suspense {...this.props} />
  }
}

export default SuspenseWithChunkError
