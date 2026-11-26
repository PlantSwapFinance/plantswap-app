import { useCallback } from 'react'
import { fetchVerticalGardensUserDataAsync } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: BigInt(VERTICALGARDEN_GAS_LIMIT),
}

const harvestVerticalGarden = async (verticalGardenContract) => {
  const tx = await verticalGardenContract.harvestGarden(options)
  const receipt = await tx.wait()
  return receipt.status
}

const useVerticalGardenHarvest = (vgId) => {
  const { account } = useActiveWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleHarvest = useCallback(async () => {
    await harvestVerticalGarden(verticalGardenContract)
    fetchVerticalGardensUserDataAsync(account).catch(console.error)
  }, [account, verticalGardenContract])

  return { onReward: handleHarvest }
}

export default useVerticalGardenHarvest
