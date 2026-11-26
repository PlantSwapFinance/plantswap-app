import { useCallback, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useApprovePool from 'hooks/useApprovePool'
import useToast from 'hooks/useToast'
import { trackEvent } from 'utils/analytics'

/**
 * Approve flow for a farm's staking token: tracks the pending state, announces
 * success, and refreshes the farm user data so the UI moves on to staking.
 * Errors and wallet rejections are toasted by `useApprovePool`.
 */
const useFarmApprove = (lpAddress: string, pid: number, lpSymbol: string, account?: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const dispatch = useAppDispatch()
  const lpContract = useERC20(lpAddress)
  const { onApprove } = useApprovePool(lpContract)
  const [requestedApproval, setRequestedApproval] = useState(false)

  const handleApprove = useCallback(async () => {
    setRequestedApproval(true)
    const params = { funnel: 'farm', farm_pid: pid, token_symbol: lpSymbol }
    trackEvent('approve_start', params)
    try {
      const approved = await onApprove()
      trackEvent(approved ? 'approve_success' : 'approve_error', params)
      if (approved) {
        toastSuccess(t('%symbol% approved', { symbol: lpSymbol }), t('You can now stake in this farm.'))
        dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      }
    } finally {
      setRequestedApproval(false)
    }
  }, [onApprove, toastSuccess, t, lpSymbol, dispatch, account, pid])

  return { handleApprove, requestedApproval }
}

export default useFarmApprove
