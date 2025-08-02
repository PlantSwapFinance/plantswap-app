import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import BigNumber from 'bignumber.js'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'
import { useVerticalGarden } from 'hooks/useContract'

const options = {
  gasLimit: VERTICALGARDEN_GAS_LIMIT,
}
const verticalDeposit = async (verticalGardenContract, amount) => {
  const tx = await verticalGardenContract.deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), options)
  const receipt = await tx.wait()
  return receipt.status
}

const useVerticalGardenStake = (vgId) => {
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleStake = useCallback(
    async (amount: string) => {
      verticalDeposit(verticalGardenContract, amount)

      dispatch(updateUserStakedBalance(vgId, account))
      dispatch(updateUserBalance(vgId, account))
    },
    [account, dispatch, verticalGardenContract, vgId],
  )

  return { onStake: handleStake }
}

export default useVerticalGardenStake
