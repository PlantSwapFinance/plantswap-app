import React from 'react'
import { SproutPlaceholderIcon, Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface ComingSoonProps {
  children?: React.ReactNode
}

const ComingSoon: React.FC<ComingSoonProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px">
      <SproutPlaceholderIcon width="72px" height="72px" />
      <Heading as="h5" scale="md" color="textDisabled">
        {children || t('Coming Soon!')}
      </Heading>
    </Flex>
  )
}

export default ComingSoon
