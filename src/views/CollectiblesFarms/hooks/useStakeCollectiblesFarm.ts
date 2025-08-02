import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import collectiblesFarmsLogsApi from 'utils/calls/collectiblesFarmsLogs'
import { COLLECTIBLESFARM_GAS_LIMIT } from 'config'
import { useCollectiblesFarmingPool } from 'hooks/useContract'

const options = {
  gasLimit: COLLECTIBLESFARM_GAS_LIMIT,
}
const nftDeposit = async (collectiblesFarmContract, tokenId) => {
  const tx = await collectiblesFarmContract.deposit(tokenId, options)
  const receipt = await tx.wait()
  return receipt.status
}

const useCollectiblesFarmStake = (cfId) => {
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()
  const collectiblesFarmContract = useCollectiblesFarmingPool(cfId)

  const handleStake = useCallback(
    async (tokenId: number) => {
      nftDeposit(collectiblesFarmContract, tokenId)
      
      collectiblesFarmsLogsApi.readCollectiblesFarmsLogByAddress(account).then((userFarmCollectibles) => {
        if (userFarmCollectibles.length === 0) {
          const newUserFarmCollectibles = {
            cfId,
            address: account,
            tokenId,
            isApproved: true,
            isStaked: true,
            stakedDate: new Date(),
          }
          collectiblesFarmsLogsApi.createCollectiblesFarmsLogs(newUserFarmCollectibles)
        }
      })

      dispatch(updateUserStakedBalance(cfId, account))
      dispatch(updateUserBalance(cfId, account))
    },
    [account, dispatch, collectiblesFarmContract, cfId],
  )

  return { onStake: handleStake }
}

export default useCollectiblesFarmStake
