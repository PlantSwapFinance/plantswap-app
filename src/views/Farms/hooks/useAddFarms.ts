import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useMasterchef } from 'hooks/useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}
const createFarm = async (collectiblesFarmContract, lpTokenAddress, allocPoint, depositFee, withUpdate) => {
  
  const tx = await collectiblesFarmContract.add(allocPoint, lpTokenAddress, depositFee, withUpdate, options)
  const receipt = await tx.wait()
  return receipt.status
}

const useAddFarms = (lpTokenAddress, allocPoint, depositFee, withUpdate) => {

  const masterGardenerContract = useMasterchef()

  const handleAddFarm = useCallback(
    async () => {
      createFarm(masterGardenerContract, lpTokenAddress, allocPoint, depositFee, withUpdate)

    },
    [masterGardenerContract, lpTokenAddress, allocPoint, depositFee, withUpdate],
  )

  return { onAddFarms: handleAddFarm }
}

export default useAddFarms
