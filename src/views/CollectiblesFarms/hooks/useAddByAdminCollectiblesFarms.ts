import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useCollectiblesFarm } from 'hooks/useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}
const createCollectiblesFarm = async (collectiblesFarmContract, nftAddress, rewardExtraToken, rewardExtraCut, variantIdStart, variantIdEnd, isUserRestricted) => {
  
  const tx = await collectiblesFarmContract.addPoolByAdmin(nftAddress, rewardExtraToken, rewardExtraCut, variantIdStart, variantIdEnd, isUserRestricted, options)
  const receipt = await tx.wait()
  return receipt.status
}

const useAddByAdminCollectiblesFarms = (nftAddress, rewardExtraToken, rewardExtraCut, variantIdStart, variantIdEnd, isUserRestricted) => {

  const collectiblesFarmContract = useCollectiblesFarm()

  const handleAddByAdmin = useCallback(
    async () => {
      createCollectiblesFarm(collectiblesFarmContract, nftAddress, rewardExtraToken, rewardExtraCut, variantIdStart, variantIdEnd, isUserRestricted)

    },
    [collectiblesFarmContract, nftAddress, rewardExtraToken, rewardExtraCut, variantIdStart, variantIdEnd, isUserRestricted],
  )

  return { onAddByAdmin: handleAddByAdmin }
}

export default useAddByAdminCollectiblesFarms
