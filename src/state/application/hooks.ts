import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useApplicationStore } from './store'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useApplicationStore((state) => state.blockNumber[chainId ?? -1])
}

export default useBlockNumber