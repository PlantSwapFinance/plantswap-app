import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
// import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import collectiblesFarmsLogsApi from 'utils/calls/collectiblesFarmsLogs'
import { useCollectiblesFarmingPool } from 'hooks/useContract'

const nftUnstake = async (collectiblesFarmContract, tokenId) => {
  const tx = await collectiblesFarmContract.withdraw(tokenId)
  const receipt = await tx.wait()
  return receipt.status
}

const useUnstakeCollectiblesFarm = (cfId) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const collectiblesFarmContract = useCollectiblesFarmingPool(cfId)

  const handleUnstake = useCallback(
    async (tokenId: number) => {
      await nftUnstake(collectiblesFarmContract, tokenId)

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
      dispatch(updateUserPendingReward(cfId, account))
    },
    [account, dispatch, collectiblesFarmContract, cfId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeCollectiblesFarm
