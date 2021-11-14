import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text, ButtonMenu, ButtonMenuItem } from '@plantswap/uikit'

interface MenuProps {
  activeIndex?: number
}

const MenuPageList: React.FC<MenuProps> = ({ activeIndex = 0 }) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex mb="24px">
        <RouterLink to="/dashboard">
          <Flex alignItems="center">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{t('Dashboard')}</Text>
          </Flex>
        </RouterLink>
      </Flex>

      <Flex mb="24px" justifyContent="center">
        <ButtonMenu activeIndex={activeIndex} variant="subtle" scale="sm">
          <ButtonMenuItem as={RouterLink} to="/dashboard/pages">
            {t('Page List')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to="/dashboard/pagesAccess">
            {t('Page Access')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Flex>
    </>
  )
}

export default MenuPageList
