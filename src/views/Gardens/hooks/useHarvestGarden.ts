import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useHarvestGarden = (gardenPid: number) => {
  const masterGardenerContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterGardenerContract, gardenPid)
  }, [gardenPid, masterGardenerContract])

  return { onReward: handleHarvest }
}

export default useHarvestGarden
