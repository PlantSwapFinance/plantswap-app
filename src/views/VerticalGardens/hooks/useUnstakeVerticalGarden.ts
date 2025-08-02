import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { BIG_TEN } from 'utils/bigNumber'

const verticalUnstake = async (verticalGardenContract, amount, decimals) => {
  const tx = await verticalGardenContract.withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
  const receipt = await tx.wait()
  return receipt.status
}

const useUnstakeVerticalGarden = (vgId) => {
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
        await verticalUnstake(verticalGardenContract, amount, decimals)

      dispatch(updateUserStakedBalance(vgId, account))
      dispatch(updateUserBalance(vgId, account))
      dispatch(updateUserPendingReward(vgId, account))
    },
    [account, dispatch, verticalGardenContract, vgId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeVerticalGarden
