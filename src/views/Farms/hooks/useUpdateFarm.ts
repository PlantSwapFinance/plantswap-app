import { useCallback, useState } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useMasterchef } from 'hooks/useContract'

/**
 * Wraps `masterGardener.set(pid, allocPoint, depositFeeBP, withUpdate)` and
 * tracks pending state for the modal's save button. Mirrors the structure of
 * `src/views/Farms/hooks/useAddFarms.ts`.
 *
 * The contract will revert with `not owner` if the connected wallet is not
 * the MasterGardener owner — that error is surfaced through the thrown
 * exception and handled by the caller's toast.
 */
const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const updatePool = async (masterGardenerContract, pid, allocPoint, depositFeeBP, withUpdate) => {
  const tx = await masterGardenerContract.set(pid, allocPoint, depositFeeBP, withUpdate, options)
  const receipt = await tx.wait()
  if (receipt.status !== 1) {
    throw new Error('Transaction failed')
  }
  return receipt
}

const useUpdateFarm = () => {
  const masterGardenerContract = useMasterchef()
  const [isPending, setIsPending] = useState(false)

  const onUpdate = useCallback(
    async (pid: number, allocPoint: string | number, depositFeeBP: number, withUpdate: boolean) => {
      setIsPending(true)
      try {
        await updatePool(masterGardenerContract, pid, allocPoint, depositFeeBP, withUpdate)
      } finally {
        setIsPending(false)
      }
    },
    [masterGardenerContract],
  )

  return { onUpdate, isPending }
}

export default useUpdateFarm