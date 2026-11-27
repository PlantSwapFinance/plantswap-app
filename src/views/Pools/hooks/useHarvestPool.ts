import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { usePoolsStore } from 'state/pools/store'
import { useTransactionAdder } from 'state/transactions/hooks'
import { harvestFarm, submitAndWait, OnTransactionSubmitted } from 'utils/calls'
import { BIG_ZERO } from 'utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { DEFAULT_GAS_LIMIT } from 'config'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(sousChefContract.deposit('0', options), onSubmitted)
}

const harvestPoolBnb = async (sousChefContract, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(sousChefContract.deposit({ ...options, value: BIG_ZERO }), onSubmitted)
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterGardenerContract = useMasterchef()
  const addTransaction = useTransactionAdder()
  const earningSymbol = usePoolsStore((state) => state.data.find((p) => p.sousId === sousId)?.earningToken?.symbol)

  const handleHarvest = useCallback(async () => {
    const onSubmitted: OnTransactionSubmitted = (tx) =>
      addTransaction(tx, { summary: `Harvest ${earningSymbol ?? ''}`.trim() })
    if (sousId === 0) {
      await harvestFarm(masterGardenerContract, 0, onSubmitted)
    } else if (isUsingBnb) {
      await harvestPoolBnb(sousChefContract, onSubmitted)
    } else {
      await harvestPool(sousChefContract, onSubmitted)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterGardenerContract, sousChefContract, sousId, addTransaction, earningSymbol])

  return { onReward: handleHarvest }
}

export default useHarvestPool
