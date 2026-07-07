import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { useCollectiblesFarmingPool } from 'hooks/useContract'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: VERTICALGARDEN_GAS_LIMIT,
}

const updateCollectiblesFarm = async (collectiblesFarmContract) => {
  const tx = await collectiblesFarmContract.updateGarden(options)
  const receipt = await tx.wait()
  return receipt.status
}

const useUpdateCollectiblesFarm = (cfId) => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const collectiblesFarmContract = useCollectiblesFarmingPool(cfId)

  const handleUpdate = useCallback(async () => {
    await updateCollectiblesFarm(collectiblesFarmContract)
    dispatch(updateUserPendingReward(cfId, account))
    dispatch(updateUserBalance(cfId, account))
  }, [account, dispatch, collectiblesFarmContract, cfId])

  return { onUpdate: handleUpdate }
}

export default useUpdateCollectiblesFarm
