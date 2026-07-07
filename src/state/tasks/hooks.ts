import { useEffect } from 'react'
import { Task } from '../types'
import { fetchTasks, useTasksStore } from './store'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

export const useFetchTasks = () => {
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account) {
      fetchTasks(account)
    }
  }, [account])
}

export const useTasks = (): Task[] => {
  return useTasksStore((state) => state.data)
}
