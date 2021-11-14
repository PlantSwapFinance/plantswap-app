import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import BigNumber from 'bignumber.js'
import { useCollectiblesFarm } from 'hooks/useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}
const initializeCollectiblesFarm = async (collectiblesFarmContract, collectiblesFarmId, amount) => {
  
  const tx = await collectiblesFarmContract.initializePoolByUser(collectiblesFarmId, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), options)
  const receipt = await tx.wait()
  return receipt.status
}

const useInitializeByUserCollectiblesFarms = (collectiblesFarmId, amount) => {
  const collectiblesFarmContract = useCollectiblesFarm()

  const handleInitialize = useCallback(
    async () => {
      initializeCollectiblesFarm(collectiblesFarmContract, collectiblesFarmId, amount)
    },
    [collectiblesFarmContract, collectiblesFarmId, amount],
  )

  return { onInitializeByUser: handleInitialize }
}

export default useInitializeByUserCollectiblesFarms
