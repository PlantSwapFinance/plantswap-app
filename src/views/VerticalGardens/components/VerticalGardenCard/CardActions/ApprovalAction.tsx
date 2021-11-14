import React from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { VerticalGarden } from 'state/types'
import { useApproveVerticalGarden } from '../../../hooks/useApprove'

interface ApprovalActionProps {
  verticalGarden: VerticalGarden
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ verticalGarden, isLoading = false }) => {
  const { vgId, stakingToken } = verticalGarden
  const { t } = useTranslation()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove, requestedApproval } = useApproveVerticalGarden(stakingTokenContract, vgId)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
