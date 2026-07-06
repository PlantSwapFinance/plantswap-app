import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface PoolTabButtonsProps {
  /**
   * Base path that prefixes each tab route (e.g. `/farms`, `/gardens`).
   * The component renders `<basePath>`, `<basePath>/history`, and `<basePath>/archived`.
   */
  basePath: string
  hasStakeInFinishedPools: boolean
}

const PoolTabButtons: React.FC<PoolTabButtonsProps> = ({ basePath, hasStakeInFinishedPools }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()

  const livePath = basePath
  const historyPath = `${basePath}/history`
  const archivedPath = `${basePath}/archived`

  let activeIndex
  switch (location.pathname) {
    case livePath:
      activeIndex = 0
      break
    case historyPath:
      activeIndex = 1
      break
    case archivedPath:
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedPools}>
          <ButtonMenuItem as={Link} to={`${url}/history`}>
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default PoolTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
