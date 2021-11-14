import React from 'react'
import { Text, TextProps } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TranslatableText as TaskDescriptionType } from 'state/types'
import styled from 'styled-components'

interface TaskDescriptionProps extends TextProps {
  description?: TaskDescriptionType
}

const Description = styled(Text).attrs({ as: 'p', fontSize: '14px' })`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description, ...props }) => {
  const { t } = useTranslation()

  if (!description) {
    return null
  }

  if (typeof description === 'string') {
    return (
      <Text as="p" color="textSubtle" fontSize="14px" {...props}>
        {description}
      </Text>
    )
  }

  const { key, data = {} } = description

  return (
    <Description color="textSubtle" {...props}>
      {t(key, data)}
    </Description>
  )
}

export default TaskDescription
