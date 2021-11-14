import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'

const options = {
  gasLimit: VERTICALGARDEN_GAS_LIMIT,
}

const updateVerticalGarden = async (verticalGardenContract) => {
  const tx = await verticalGardenContract.updateGarden(options)
  const receipt = await tx.wait()
  return receipt.status
}

const useUpdateVerticalGarden = (vgId) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleUpdate = useCallback(async () => {
    await updateVerticalGarden(verticalGardenContract)
    dispatch(updateUserPendingReward(vgId, account))
    dispatch(updateUserBalance(vgId, account))
  }, [account, dispatch, verticalGardenContract, vgId])

  return { onUpdate: handleUpdate }
}

export default useUpdateVerticalGarden
