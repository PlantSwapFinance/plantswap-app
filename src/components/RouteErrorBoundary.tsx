import React, { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button,
  Card,
  CardBody,
  ErrorBoundary,
  ErrorBoundaryFallbackProps,
  Flex,
  Heading,
  RefreshIcon,
  Text,
  WarningIcon,
} from '@plantswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 128px);
`

const StyledCard = styled(Card)`
  max-width: 480px;
  width: 100%;
`

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;

  & > svg {
    margin-bottom: 16px;
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`

const Details = styled.pre`
  margin-top: 16px;
  max-height: 200px;
  width: 100%;
  text-align: left;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const RouteErrorFallback = ({ error, errorInfo, resetErrorBoundary }: ErrorBoundaryFallbackProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goHome = () => {
    // Navigating changes `pathname`, which resets the boundary via resetKeys.
    // Already on "/" means no reset would happen, so reset explicitly.
    if (pathname === '/') {
      resetErrorBoundary()
    } else {
      navigate('/')
    }
  }

  return (
    <Page>
      <Wrapper>
        <StyledCard>
          <CardBody>
            <Content>
              <WarningIcon width="48px" color="warning" />
              <Heading scale="md" mb="8px" textAlign="center">
                {t('Something went wrong')}
              </Heading>
              <Text color="textSubtle" mb="24px" textAlign="center">
                {t('This page could not be displayed. Try again, or go back to the home page.')}
              </Text>
              <Actions>
                <Button scale="sm" onClick={resetErrorBoundary} startIcon={<RefreshIcon color="currentColor" />}>
                  {t('Retry')}
                </Button>
                <Button scale="sm" variant="secondary" onClick={goHome}>
                  {t('Go home')}
                </Button>
              </Actions>
              {import.meta.env.DEV && (
                <Details>
                  {error.message}
                  {errorInfo?.componentStack}
                </Details>
              )}
            </Content>
          </CardBody>
        </StyledCard>
      </Wrapper>
    </Page>
  )
}

/** Keeps Menu mounted on route crashes; shows Retry / Go home and resets on navigation. */
const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation()

  return (
    <ErrorBoundary
      resetKeys={[pathname]}
      fallback={(props) => <RouteErrorFallback {...props} />}
      onError={(error, errorInfo) => {
        console.error('Route render error', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default RouteErrorBoundary
