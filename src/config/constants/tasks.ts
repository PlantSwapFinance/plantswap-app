import { Task } from './types'

/**
 * id: The campaign id (required)
 * type: The type of the achievement
 * title: A string or an object to be translated.
 * Note: If the value is a string it is likely used as data in a translation object
 *
 * badge: Task avatar
 */

const tasks: Task[] = [
  {
    id: '100',
    type: 'participation',
    title: 'Collected Active Lily',
    badge: 'achievement-active-lily.svg',
  },
  {
    id: '101',
    type: 'participation',
    title: 'Collected Active Lily',
    badge: 'achievement-active-lily.svg',
  },
  {
    id: '102',
    type: 'participation',
    title: 'Collected Active Lily',
    badge: 'achievement-active-lily.svg',
  },
  {
    id: '103',
    type: 'participation',
    title: 'Collected Active Lily',
    badge: 'achievement-active-lily.svg',
  },
  {
    id: '104',
    type: 'participation',
    title: 'Collected Active Lily',
    badge: 'achievement-active-lily.svg',
  },
]

/**
 * Transform the campaign config into a map. Keeps the config the same
 * as the others and allows easy access to a campaign by id
 */
export const taskMap = new Map<string, Task>()

tasks.forEach((task) => {
  taskMap.set(task.id, task)
})

export default tasks
