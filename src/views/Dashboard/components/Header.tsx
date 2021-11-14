import React from 'react'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import HeaderWrapper from './HeaderWrapper'

const ProfileHeader = () => {
  const { t } = useTranslation()

  return (
    <HeaderWrapper>
      <br />
      <br />
      <br />
      <Flex
        flexDirection={['column', null, 'row']}
        alignItems={['start', null, 'center']}
        justifyContent="space-between"
      >
          <Heading as="h1" scale="xxl" mb="8px" color="secondary">
            {t('Dashboard')}
          </Heading>
      </Flex>
    </HeaderWrapper>
  )
}

export default ProfileHeader
