import { useCallback } from 'react'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useFarmFromPid } from 'state/farms/hooks'

const useUnstakePool = (pid: number) => {
  const masterGardenerContract = useMasterchef()
  const addTransaction = useTransactionAdder()
  const lpSymbol = useFarmFromPid(pid)?.lpSymbol ?? `#${pid}`

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstakeFarm(masterGardenerContract, pid, amount, (tx) =>
        addTransaction(tx, { summary: `Unstake ${amount} ${lpSymbol}` }),
      )
    },
    [masterGardenerContract, pid, addTransaction, lpSymbol],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
