import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { fetchVerticalGardensUserDataAsync } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useVerticalGardensStore } from 'state/verticalGardens/store'
import { BIG_TEN } from 'utils/bigNumber'
import { submitAndWait, OnTransactionSubmitted } from 'utils/calls'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const verticalUnstake = async (verticalGardenContract, amount, decimals, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(
    verticalGardenContract.withdraw(
      new BigNumber(amount).times(BIG_TEN.pow(decimals)).integerValue(BigNumber.ROUND_DOWN).toFixed(),
    ),
    onSubmitted,
  )
}

const useUnstakeVerticalGarden = (vgId) => {
  const { account } = useActiveWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)
  const addTransaction = useTransactionAdder()
  const stakingSymbol = useVerticalGardensStore(
    (state) => state.data.find((vg) => String(vg.vgId) === String(vgId))?.stakingToken?.symbol,
  )

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      await verticalUnstake(verticalGardenContract, amount, decimals, (tx) =>
        addTransaction(tx, {
          summary: `Unstake ${amount} ${stakingSymbol ?? 'tokens'} from Vertical Garden`,
        }),
      )

      fetchVerticalGardensUserDataAsync(account).catch(console.error)
    },
    [account, verticalGardenContract, addTransaction, stakingSymbol],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeVerticalGarden
