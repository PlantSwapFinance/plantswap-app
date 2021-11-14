import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { useCollectiblesFarmingPool } from 'hooks/useContract'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'

const options = {
  gasLimit: VERTICALGARDEN_GAS_LIMIT,
}

const harvestCollectiblesFarm = async (collectiblesFarmContract) => {
  const tx = await collectiblesFarmContract.harvestGarden(options)
  const receipt = await tx.wait()
  return receipt.status
}

const useCollectiblesFarmHarvest = (cfId) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const collectiblesFarmContract = useCollectiblesFarmingPool(cfId)

  const handleHarvest = useCallback(async () => {
    await harvestCollectiblesFarm(collectiblesFarmContract)
    dispatch(updateUserPendingReward(cfId, account))
    dispatch(updateUserBalance(cfId, account))
  }, [account, dispatch, collectiblesFarmContract, cfId])

  return { onReward: handleHarvest }
}

export default useCollectiblesFarmHarvest
