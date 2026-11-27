import { useCallback } from 'react'
import { Contract, MaxUint256 } from 'ethers'
import { useMasterchef } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useTransactionAdder } from 'state/transactions/hooks'
import { submitAndWait } from 'utils/calls'
import { getTxErrorToast } from 'utils/txError'

/**
 * Approves the MasterGardener to spend `lpContract` tokens.
 * Resolves to `true` once the approval is mined, `false` otherwise. Failures and
 * wallet rejections are surfaced to the user with an error toast; the caller decides
 * how to announce success. The transaction is recorded in the persisted transaction store.
 */
const useApprovePool = (lpContract: Contract, summary = 'Approve LP token') => {
  const masterGardenerContract = useMasterchef()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const addTransaction = useTransactionAdder()
  const handleApprove = useCallback(async (): Promise<boolean> => {
    try {
      const spender = String(masterGardenerContract.target)
      // ethers v6 tx.wait() throws if the transaction reverts, so resolving means it succeeded
      await submitAndWait(lpContract.approve(spender, MaxUint256), (tx) =>
        addTransaction(tx, { summary, approval: { tokenAddress: String(lpContract.target), spender } }),
      )
      return true
    } catch (e) {
      console.error(e)
      const { title, description } = getTxErrorToast(e)
      toastError(t(title), t(description))
      return false
    }
  }, [lpContract, masterGardenerContract, t, toastError, addTransaction, summary])

  return { onApprove: handleApprove }
}

export default useApprovePool
