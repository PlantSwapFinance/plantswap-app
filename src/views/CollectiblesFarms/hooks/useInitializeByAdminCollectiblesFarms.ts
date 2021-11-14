import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useCollectiblesFarm } from 'hooks/useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}
const initializeCollectiblesFarm = async (collectiblesFarmContract, collectiblesFarmId, pid) => {
  
  const tx = await collectiblesFarmContract.initializePoolByAdmin(collectiblesFarmId, pid, options)
  const receipt = await tx.wait()
  return receipt.status
}

const useInitializeByAdminCollectiblesFarms = (collectiblesFarmId, pid) => {

  const collectiblesFarmContract = useCollectiblesFarm()

  const handleInitialize = useCallback(
    async () => {
      initializeCollectiblesFarm(collectiblesFarmContract, collectiblesFarmId, pid)

    },
    [collectiblesFarmContract, collectiblesFarmId, pid],
  )

  return { onInitializeByAdmin: handleInitialize }
}

export default useInitializeByAdminCollectiblesFarms
