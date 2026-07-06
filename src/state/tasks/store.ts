import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Task, TaskState } from '../types'
import { getTasks } from './helpers'

export interface TaskAction {
  type: 'tasks/addTask' | 'tasks/addTasks' | 'tasks/setTasks' | 'tasks/clearTasks'
  payload?: Task | Task[]
}

export const initialState: TaskState = {
  data: [],
}

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'tasks/addTask':
      return { data: [...state.data, action.payload as Task] }
    case 'tasks/addTasks':
      return { data: [...state.data, ...(action.payload as Task[])] }
    case 'tasks/setTasks':
      return { data: (action.payload as Task[]) ?? [] }
    case 'tasks/clearTasks':
      return { data: [] }
    default:
      return state
  }
}

export const useTasksStore = create<TaskState>()(
  devtools(
    () => initialState,
    { name: 'tasks' },
  ),
)

export const addTask = (payload: Task): void => {
  useTasksStore.setState((state) => taskReducer(state, { type: 'tasks/addTask', payload }), false, 'tasks/addTask')
}
export const addTasks = (payload: Task[]): void => {
  useTasksStore.setState((state) => taskReducer(state, { type: 'tasks/addTasks', payload }), false, 'tasks/addTasks')
}
export const setTasks = (payload: Task[]): void => {
  useTasksStore.setState((state) => taskReducer(state, { type: 'tasks/setTasks', payload }), false, 'tasks/setTasks')
}
export const clearTasks = (): void => {
  useTasksStore.setState((state) => taskReducer(state, { type: 'tasks/clearTasks' }), false, 'tasks/clearTasks')
}

/**
 * Async thunk replacement — fetches tasks for an account and stores the
 * result. Errors are swallowed to match the pre-migration behaviour.
 */
export const fetchTasks = async (account: string): Promise<void> => {
  try {
    const tasks = await getTasks(account)
    setTasks(tasks)
  } catch (error) {
    console.error(error)
  }
}