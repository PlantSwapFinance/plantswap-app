import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { ethers, Contract } from 'ethers'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

export const useApproveCollectiblesFarmForAll = (collectiblesFarmingPoolContract: Contract, cfId) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const tx = await collectiblesFarmingPoolContract.setApprovalForAll(collectiblesFarmingPoolContract, ethers.constants.MaxUint256)
      const receipt = await tx.wait()

      dispatch(updateUserAllowance(cfId, account))
      if (receipt.status) {
        toastSuccess(
          t('Contract Enabled'),
          t('You can now stake in thecollectiblesFarm!'),
        )
        setRequestedApproval(false)
      } else {
        // user rejected tx or didn't go thru
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }, [account, dispatch, collectiblesFarmingPoolContract, cfId, t, toastError, toastSuccess])

  return { handleApprove, requestedApproval }
}
