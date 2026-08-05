import React from 'react'
import { Button, Text, Box } from '@plantswap/uikit'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
  info: React.ErrorInfo | null
}

/**
 * Global render-time error boundary.
 *
 * Wraps the entire app in `src/index.tsx`. If any component throws during
 * render, commit, or in a layout effect, React unmounts the tree and
 * routes the error here instead of leaving the user with a white page.
 *
 * `componentDidCatch` also forwards the error to the console so the usual
 * dev overlay still sees it during development.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught a render error:', error, info)
    this.setState({ info })
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children

    return (
      <Box
        position="relative"
        maxWidth="720px"
        mx="auto"
        mt="64px"
        mb="64px"
        px="24px"
        py="32px"
        borderRadius="16px"
        style={{
          background: 'rgba(255, 87, 87, 0.06)',
          border: '1px solid rgba(255, 87, 87, 0.4)',
        }}
      >
        <Text as="h1" fontSize="32px" bold color="failure" mb="16px">
          Something went wrong rendering this page.
        </Text>
        <Text color="textSubtle" mb="16px">
          The app caught an unhandled error before it could white-screen. The full
          message is below — please copy it into a bug report.
        </Text>

        <Box
          as="pre"
          mb="16px"
          p="16px"
          borderRadius="8px"
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
            maxHeight: '320px',
          }}
        >
          <strong>{error.name}: {error.message}</strong>
          {'\n\n'}
          {error.stack ?? '(no stack)'}
          {info?.componentStack ? `\n\nComponent stack:\n${info.componentStack}` : ''}
        </Box>

        <Button onClick={this.handleReload}>Reload the page</Button>
      </Box>
    )
  }
}

export default ErrorBoundary
