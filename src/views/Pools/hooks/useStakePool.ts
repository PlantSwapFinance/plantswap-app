import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { usePoolsStore } from 'state/pools/store'
import { useTransactionAdder } from 'state/transactions/hooks'
import { stakeFarm, submitAndWait, OnTransactionSubmitted } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract, amount, decimals = 18, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(
    sousChefContract.deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), options),
    onSubmitted,
  )
}

const sousStakeBnb = async (sousChefContract, amount, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(
    sousChefContract.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), options),
    onSubmitted,
  )
}

const useStakePool = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const masterGardenerContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const addTransaction = useTransactionAdder()
  const stakingSymbol = usePoolsStore((state) => state.data.find((p) => p.sousId === sousId)?.stakingToken?.symbol)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      const onSubmitted: OnTransactionSubmitted = (tx) =>
        addTransaction(tx, { summary: `Stake ${amount} ${stakingSymbol ?? ''}`.trim() })
      if (sousId === 0) {
        await stakeFarm(masterGardenerContract, 0, amount, onSubmitted)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, onSubmitted)
      } else {
        await sousStake(sousChefContract, amount, decimals, onSubmitted)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterGardenerContract, sousChefContract, sousId, addTransaction, stakingSymbol],
  )

  return { onStake: handleStake }
}

export default useStakePool
