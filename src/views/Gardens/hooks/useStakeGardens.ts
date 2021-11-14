import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useStakeGardens = (pid: number) => {
  const masterGardenerContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeFarm(masterGardenerContract, pid, amount)
      console.info(txHash)
    },
    [masterGardenerContract, pid],
  )

  return { onStake: handleStake }
}

export default useStakeGardens
