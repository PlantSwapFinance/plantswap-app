import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useTasks } from 'state/tasks/hooks'
import TaskCard from './TaskCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const TaskTitlesList = () => {
  const { t } = useTranslation()
  const tasks = useTasks()

  return (
    <>
      <Grid>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Grid>
      {tasks.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No tasks yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default TaskTitlesList
