import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useHarvestPool = (pid: number) => {
  const masterGardenerContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterGardenerContract, pid)
  }, [masterGardenerContract, pid])

  return { onReward: handleHarvest }
}

export default useHarvestPool
