import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { usePoolsStore } from 'state/pools/store'
import { useTransactionAdder } from 'state/transactions/hooks'
import { unstakeFarm, submitAndWait, OnTransactionSubmitted } from 'utils/calls'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { BIG_TEN } from 'utils/bigNumber'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const sousUnstake = async (sousChefContract, amount, decimals, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(
    sousChefContract.withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()),
    onSubmitted,
  )
}

const sousEmergencyUnstake = async (sousChefContract, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(sousChefContract.emergencyWithdraw(), onSubmitted)
}

const useUnstakePool = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const masterGardenerContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const addTransaction = useTransactionAdder()
  const stakingSymbol = usePoolsStore((state) => state.data.find((p) => p.sousId === sousId)?.stakingToken?.symbol)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      const symbol = stakingSymbol ?? ''
      if (sousId === 0) {
        await unstakeFarm(masterGardenerContract, 0, amount, (tx) =>
          addTransaction(tx, { summary: `Unstake ${amount} ${symbol}`.trim() }),
        )
      } else if (enableEmergencyWithdraw) {
        await sousEmergencyUnstake(sousChefContract, (tx) =>
          addTransaction(tx, { summary: `Emergency unstake ${symbol}`.trim() }),
        )
      } else {
        await sousUnstake(sousChefContract, amount, decimals, (tx) =>
          addTransaction(tx, { summary: `Unstake ${amount} ${symbol}`.trim() }),
        )
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [
      account,
      dispatch,
      enableEmergencyWithdraw,
      masterGardenerContract,
      sousChefContract,
      sousId,
      addTransaction,
      stakingSymbol,
    ],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
