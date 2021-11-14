import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useCollectiblesFarm } from 'hooks/useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}
const createCollectiblesFarm = async (collectiblesFarmContract, nftAddress, rewardExtraToken, variantIdStart, variantIdEnd, isUserRestricted) => {
  
  const tx = await collectiblesFarmContract.addPoolByUser(nftAddress, rewardExtraToken, variantIdStart, variantIdEnd, isUserRestricted, options)
  const receipt = await tx.wait()
  return receipt.status
}

const useAddByUserCollectiblesFarms = (nftAddress, rewardExtraToken, variantIdStart, variantIdEnd, isUserRestricted) => {

  const collectiblesFarmContract = useCollectiblesFarm()

  const handleAddByUser = useCallback(
    async () => {
      createCollectiblesFarm(collectiblesFarmContract, nftAddress, rewardExtraToken, variantIdStart, variantIdEnd, isUserRestricted)

    },
    [collectiblesFarmContract, nftAddress, rewardExtraToken, variantIdStart, variantIdEnd, isUserRestricted],
  )

  return { onAddByUser: handleAddByUser }
}

export default useAddByUserCollectiblesFarms
