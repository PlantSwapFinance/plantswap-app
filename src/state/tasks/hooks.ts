import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Task } from '../types'
import { fetchTasks, useTasksStore } from './store'

export const useFetchTasks = () => {
  const { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      fetchTasks(account)
    }
  }, [account])
}

export const useTasks = (): Task[] => {
  return useTasksStore((state) => state.data)
}