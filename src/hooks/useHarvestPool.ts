import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useFarmFromPid } from 'state/farms/hooks'

const useHarvestPool = (pid: number) => {
  const masterGardenerContract = useMasterchef()
  const addTransaction = useTransactionAdder()
  const lpSymbol = useFarmFromPid(pid)?.lpSymbol ?? `#${pid}`

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterGardenerContract, pid, (tx) => addTransaction(tx, { summary: `Harvest ${lpSymbol}` }))
  }, [masterGardenerContract, pid, addTransaction, lpSymbol])

  return { onReward: handleHarvest }
}

export default useHarvestPool
