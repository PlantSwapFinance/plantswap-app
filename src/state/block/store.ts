import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { BlockState } from '../types'

export const initialState: BlockState = { currentBlock: 0, initialBlock: 0 }

export const useBlockStore = create<BlockState>()(
  devtools(
    () => initialState,
    { name: 'block' },
  ),
)

export const setBlock = (payload: number): void => {
  useBlockStore.setState(
    (state) => ({
      currentBlock: payload,
      // First non-zero blockNumber becomes the initialBlock reference.
      initialBlock: state.initialBlock === 0 ? payload : state.initialBlock,
    }),
    false,
    'Block/setBlock',
  )
}