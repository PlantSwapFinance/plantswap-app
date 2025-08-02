import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'

const options = {
  gasLimit: VERTICALGARDEN_GAS_LIMIT,
}

const harvestVerticalGarden = async (verticalGardenContract) => {
  const tx = await verticalGardenContract.harvestGarden(options)
  const receipt = await tx.wait()
  return receipt.status
}

const useVerticalGardenHarvest = (vgId) => {
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleHarvest = useCallback(async () => {
    await harvestVerticalGarden(verticalGardenContract)
    dispatch(updateUserPendingReward(vgId, account))
    dispatch(updateUserBalance(vgId, account))
  }, [account, dispatch, verticalGardenContract, vgId])

  return { onReward: handleHarvest }
}

export default useVerticalGardenHarvest
