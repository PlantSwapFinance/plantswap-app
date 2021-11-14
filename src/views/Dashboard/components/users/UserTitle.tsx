import React from 'react'
import { Text, TextProps } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TranslatableText as UserTitleType } from 'config/constants/types'

interface UserTitleProps extends TextProps {
  title: UserTitleType
}

const UserTitle: React.FC<UserTitleProps> = ({ title, ...props }) => {
  const { t } = useTranslation()

  if (typeof title === 'string') {
    return (
      <Text bold {...props}>
        {title}
      </Text>
    )
  }

  const { key, data = {} } = title

  return (
    <Text bold {...props}>
      {t(key, data)}
    </Text>
  )
}

export default UserTitle
