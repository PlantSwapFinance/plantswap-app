import React from 'react'
import { Modal, Flex, Text } from '@plantswap/uikit'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { usePlant, useProfile } from 'hooks/useContract'
import { getPlantswapGardenersAddress } from 'utils/addressHelpers'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { fetchProfile } from 'state/profile'
import useToast from 'hooks/useToast'
import { REGISTER_COST } from '../ProfileCreation/config'
import ApproveConfirmButtons from './ApproveConfirmButtons'
import { State } from '../ProfileCreation/contexts/types'

interface Props {
  userName: string
  selectedNft: State['selectedNft']
  account: string
  teamId: number
  minimumPlantRequired: BigNumber
  allowance: BigNumber
  onDismiss?: () => void
}

const ConfirmProfileCreationModal: React.FC<Props> = ({
  account,
  teamId,
  selectedNft,
  minimumPlantRequired,
  allowance,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const profileContract = useProfile()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const plantContract = usePlant()
  const plantswapGardenersContract = getPlantswapGardenersAddress()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await plantContract.allowance(account, profileContract.address)
          const currentAllowance = new BigNumber(response.toString())
          return currentAllowance.gte(minimumPlantRequired)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return plantContract.approve(profileContract.address, allowance.toJSON())
      },
      onConfirm: () => {
        return profileContract.createProfile(teamId, plantswapGardenersContract, selectedNft.tokenId)
      },
      onSuccess: async () => {
        await dispatch(fetchProfile(account))
        onDismiss()
        toastSuccess(t('Profile created!'))
      },
    })

  return (
    <Modal title={t('Complete Profile')} onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submitting your Gardener NFT to the Plantswap Profile contract and confirming your Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t('%num% PLANT', { num: REGISTER_COST })}</Text>
      </Flex>
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export default ConfirmProfileCreationModal
