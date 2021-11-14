import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { TaskState, Task } from '../types'
import { getTasks } from './helpers'

const initialState: TaskState = {
  data: [],
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.data.push(action.payload)
    },
    addTasks: (state, action: PayloadAction<Task[]>) => {
      state.data = [...state.data, ...action.payload]
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.data = action.payload
    },
    clearTasks: (state) => {
      state.data = []
    },
  },
})

// Actions
export const { addTask, addTasks, setTasks, clearTasks } = taskSlice.actions

// Thunks
export const fetchTasks = (account: string) => async (dispatch: Dispatch) => {
  try {
    const tasks = await getTasks(account)
    dispatch(setTasks(tasks))
  } catch (error) {
    console.error(error)
  }
}

export default taskSlice.reducer
