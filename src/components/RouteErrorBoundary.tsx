import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@plantswap/uikit'

/** Keeps Menu mounted on route crashes; resets on navigation. */
const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation()

  return (
    <ErrorBoundary
      resetKeys={[pathname]}
      onError={(error, errorInfo) => {
        console.error('Route render error', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default RouteErrorBoundary
