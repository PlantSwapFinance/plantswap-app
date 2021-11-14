import { useCallback } from 'react'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useUnstakeGardens = (pid: number) => {
  const masterGardenerContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstakeFarm(masterGardenerContract, pid, amount)
    },
    [masterGardenerContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeGardens
