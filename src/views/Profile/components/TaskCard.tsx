import React from 'react'
import styled from 'styled-components'
import { Flex, PrizeIcon, Text } from '@plantswap/uikit'
import { Task } from 'state/types'
import TaskAvatar from './TaskAvatar'
import TaskTitle from './TaskTitle'
import TaskDescription from './TaskDescription'

interface TaskCardProps {
  task: Task
}

const Details = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
`

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <Flex>
      <TaskAvatar badge={task.badge} />
      <Details>
        <TaskTitle title={task.title} />
        <TaskDescription description={task.description} />
      </Details>
      <Flex alignItems="center">
        <PrizeIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle">{task.points.toLocaleString()}</Text>
      </Flex>
    </Flex>
  )
}

export default TaskCard
