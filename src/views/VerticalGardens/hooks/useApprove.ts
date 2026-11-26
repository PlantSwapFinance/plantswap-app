import { useCallback, useState } from 'react'
import { Contract, MaxUint256 } from 'ethers'
import { vgupdateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useTransactionAdder } from 'state/transactions/hooks'
import { submitAndWait } from 'utils/calls'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const isUserRejection = (e: any): boolean =>
  e?.code === 'ACTION_REJECTED' || e?.code === 4001 || e?.info?.error?.code === 4001

/**
 * Approves the vertical garden contract to spend the user's staking token.
 *
 * @param stakingTokenContract ERC20 contract of the token being staked
 * @param verticalGardenContractAddress address of the vertical garden (the spender)
 * @param vgId id of the vertical garden, used to refresh the stored allowance
 * @param symbol staking token symbol, used in the success toast
 */
export const useApproveVerticalGarden = (
  stakingTokenContract: Contract,
  verticalGardenContractAddress: string,
  vgId,
  symbol: string,
) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError, toastInfo } = useToast()
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      // ethers v6 tx.wait() throws if the transaction reverts
      await submitAndWait(stakingTokenContract.approve(verticalGardenContractAddress, MaxUint256), (tx) =>
        addTransaction(tx, {
          summary: `Approve ${symbol} for Vertical Garden`,
          approval: { tokenAddress: String(stakingTokenContract.target), spender: verticalGardenContractAddress },
        }),
      )

      await vgupdateUserAllowance(vgId, account)
      toastSuccess(t('Contract Enabled'), t('You can now stake in the %symbol% vertical Garden!', { symbol }))
    } catch (e) {
      console.error(e)
      if (isUserRejection(e)) {
        toastInfo(t('Approval cancelled'), t('You cancelled the request in your wallet.'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } finally {
      setRequestedApproval(false)
    }
  }, [
    account,
    stakingTokenContract,
    verticalGardenContractAddress,
    vgId,
    symbol,
    t,
    toastError,
    toastInfo,
    toastSuccess,
    addTransaction,
  ])

  return { handleApprove, requestedApproval }
}
