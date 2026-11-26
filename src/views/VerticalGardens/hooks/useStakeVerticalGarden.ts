import { useCallback } from 'react'
import { fetchVerticalGardensUserDataAsync } from 'state/actions'
import BigNumber from 'bignumber.js'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'
import { useVerticalGarden } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useVerticalGardensStore } from 'state/verticalGardens/store'
import { BIG_TEN } from 'utils/bigNumber'
import { submitAndWait, OnTransactionSubmitted } from 'utils/calls'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: BigInt(VERTICALGARDEN_GAS_LIMIT),
}
const verticalDeposit = async (
  verticalGardenContract,
  amount: string,
  decimals: number,
  onSubmitted?: OnTransactionSubmitted,
) => {
  // ethers v6 tx.wait() throws if the transaction reverts
  return submitAndWait(
    verticalGardenContract.deposit(
      new BigNumber(amount).times(BIG_TEN.pow(decimals)).integerValue(BigNumber.ROUND_DOWN).toFixed(),
      options,
    ),
    onSubmitted,
  )
}

const useVerticalGardenStake = (vgId) => {
  const { account } = useActiveWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)
  const addTransaction = useTransactionAdder()
  const stakingSymbol = useVerticalGardensStore(
    (state) => state.data.find((vg) => String(vg.vgId) === String(vgId))?.stakingToken?.symbol,
  )

  const handleStake = useCallback(
    async (amount: string, decimals = 18) => {
      // Errors (wallet rejection, revert) propagate so the caller can show an error instead of a success toast
      await verticalDeposit(verticalGardenContract, amount, decimals, (tx) =>
        addTransaction(tx, { summary: `Stake ${amount} ${stakingSymbol ?? 'tokens'} in Vertical Garden` }),
      )

      // Refresh balances only once the deposit is mined
      fetchVerticalGardensUserDataAsync(account).catch(console.error)
    },
    [account, verticalGardenContract, addTransaction, stakingSymbol],
  )

  return { onStake: handleStake }
}

export default useVerticalGardenStake
