import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State, TaskState } from '../types'
import { fetchTasks } from '.'

export const useFetchTasks = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchTasks(account))
    }
  }, [account, dispatch])
}

export const useTasks = () => {
  const tasks: TaskState['data'] = useSelector((state: State) => state.tasks.data)
  return tasks
}
