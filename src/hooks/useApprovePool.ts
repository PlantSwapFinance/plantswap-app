import { useCallback } from 'react'
import { Contract, MaxUint256 } from 'ethers'
import { useMasterchef } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { getTxErrorToast } from 'utils/txError'

/**
 * Approves the MasterGardener to spend `lpContract` tokens.
 * Resolves to `true` once the approval is mined, `false` otherwise. Failures and
 * wallet rejections are surfaced to the user with an error toast; the caller decides
 * how to announce success.
 */
const useApprovePool = (lpContract: Contract) => {
  const masterGardenerContract = useMasterchef()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const handleApprove = useCallback(async (): Promise<boolean> => {
    try {
      const tx = await lpContract.approve(String(masterGardenerContract.target), MaxUint256)
      const receipt = await tx.wait()
      return Boolean(receipt?.status)
    } catch (e) {
      console.error(e)
      const { title, description } = getTxErrorToast(e)
      toastError(t(title), t(description))
      return false
    }
  }, [lpContract, masterGardenerContract, t, toastError])

  return { onApprove: handleApprove }
}

export default useApprovePool
