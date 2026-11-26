import { useCallback, useState } from 'react'
import { Contract, MaxUint256 } from 'ethers'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useSousChef } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useTransactionAdder } from 'state/transactions/hooks'
import { submitAndWait } from 'utils/calls'
import { getTxErrorToast } from 'utils/txError'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export const useApprovePool = (lpContract: Contract, sousId, earningTokenSymbol) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const sousChefContract = useSousChef(sousId)
  const addTransaction = useTransactionAdder()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const spender = String(sousChefContract.target)
      // ethers v6 tx.wait() throws if the transaction reverts, so resolving means it succeeded
      await submitAndWait(lpContract.approve(spender, MaxUint256), (tx) =>
        addTransaction(tx, {
          summary: `Enable ${earningTokenSymbol} pool`,
          approval: { tokenAddress: String(lpContract.target), spender },
        }),
      )

      dispatch(updateUserAllowance(sousId, account))
      toastSuccess(t('Contract Enabled'), t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol }))
    } catch (e) {
      console.error(e)
      const { title, description } = getTxErrorToast(e)
      toastError(t(title), t(description))
    } finally {
      setRequestedApproval(false)
    }
  }, [
    account,
    dispatch,
    lpContract,
    sousChefContract,
    sousId,
    earningTokenSymbol,
    t,
    toastError,
    toastSuccess,
    addTransaction,
  ])

  return { handleApprove, requestedApproval }
}
