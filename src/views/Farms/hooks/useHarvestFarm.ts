import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useHarvestFarm = (farmPid: number) => {
  const masterGardenerContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterGardenerContract, farmPid)
  }, [farmPid, masterGardenerContract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
