import { useEffect } from 'react'
import { simpleRpcProvider } from 'utils/providers'
import { BlockState } from '../types'
import { setBlock, useBlockStore } from './store'

export const usePollBlockNumber = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      setBlock(blockNumber)
    }, 6000)

    return () => clearInterval(interval)
  }, [])
}

export const useBlock = (): BlockState => {
  return useBlockStore()
}

export const useInitialBlock = (): number => {
  return useBlockStore((state) => state.initialBlock)
}