import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface NftTabButtonsProps {
  isClaimable: boolean
}

const NftTabButtons: React.FC<NftTabButtonsProps> = ({ isClaimable }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()

  let activeIndex
  switch (location.pathname) {
    case '/collectibles':
      activeIndex = 0
      break
    case '/collectibles/claimable':
      activeIndex = 1
      break
    case '/collectibles/archived':
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
          {t('All')}
        </ButtonMenuItem>
        <NotificationDot show={isClaimable}>
          <ButtonMenuItem as={Link} to={`${url}/claimable`}>
            {t('Claimable')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default NftTabButtons

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
