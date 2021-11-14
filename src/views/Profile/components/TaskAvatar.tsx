import React, { ImgHTMLAttributes } from 'react'
import styled from 'styled-components'
import { SproutPlaceholderIcon } from '@plantswap/uikit'

interface TaskAvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  badge?: string
}

const NoBadgePlaceholder = styled(SproutPlaceholderIcon)`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const StyledTaskAvatar = styled.img`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const TaskAvatar: React.FC<TaskAvatarProps> = ({ badge, ...props }) => {
  if (!badge) {
    return <NoBadgePlaceholder />
  }

  return <StyledTaskAvatar src={`/images/achievements/${badge}`} alt="task badge" {...props} />
}

export default TaskAvatar
