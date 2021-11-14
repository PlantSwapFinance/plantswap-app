import React from 'react'
import { Text, TextProps } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TranslatableText as TaskTitleType } from 'state/types'

interface TaskTitleProps extends TextProps {
  title: TaskTitleType
}

const TaskTitle: React.FC<TaskTitleProps> = ({ title, ...props }) => {
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

export default TaskTitle
