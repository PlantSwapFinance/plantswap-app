import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useFarmFromPid } from 'state/farms/hooks'

const useStakePool = (pid: number) => {
  const masterGardenerContract = useMasterchef()
  const addTransaction = useTransactionAdder()
  const lpSymbol = useFarmFromPid(pid)?.lpSymbol ?? `#${pid}`

  const handleStake = useCallback(
    async (amount: string) => {
      await stakeFarm(masterGardenerContract, pid, amount, (tx) =>
        addTransaction(tx, { summary: `Stake ${amount} ${lpSymbol}` }),
      )
    },
    [masterGardenerContract, pid, addTransaction, lpSymbol],
  )

  return { onStake: handleStake }
}

export default useStakePool
