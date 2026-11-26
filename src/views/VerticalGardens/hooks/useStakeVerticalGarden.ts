import { useCallback } from 'react'
import { fetchVerticalGardensUserDataAsync } from 'state/actions'
import BigNumber from 'bignumber.js'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'
import { useVerticalGarden } from 'hooks/useContract'
import { BIG_TEN } from 'utils/bigNumber'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: BigInt(VERTICALGARDEN_GAS_LIMIT),
}
const verticalDeposit = async (verticalGardenContract, amount: string, decimals: number) => {
  const tx = await verticalGardenContract.deposit(
    new BigNumber(amount).times(BIG_TEN.pow(decimals)).integerValue(BigNumber.ROUND_DOWN).toFixed(),
    options,
  )
  // ethers v6 tx.wait() throws if the transaction reverts
  const receipt = await tx.wait()
  return receipt.status
}

const useVerticalGardenStake = (vgId) => {
  const { account } = useActiveWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleStake = useCallback(
    async (amount: string, decimals = 18) => {
      // Errors (wallet rejection, revert) propagate so the caller can show an error instead of a success toast
      await verticalDeposit(verticalGardenContract, amount, decimals)

      // Refresh balances only once the deposit is mined
      fetchVerticalGardensUserDataAsync(account).catch(console.error)
    },
    [account, verticalGardenContract],
  )

  return { onStake: handleStake }
}

export default useVerticalGardenStake
