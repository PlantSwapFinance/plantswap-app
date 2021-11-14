import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { Button, InjectedModalProps, Modal, Text, Flex } from '@plantswap/uikit'
import { Nft } from 'config/constants/types'
import useHasPlantBalance from 'hooks/useHasPlantBalance'
import { usePlant, useMasterGardeningSchoolNftContract } from 'hooks/useContract'
import { getMasterGardeningSchoolNftAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import ApproveConfirmButtons from './ApproveConfirmButtons'

interface ClaimNftModalProps extends InjectedModalProps {
  nft: Nft
  onSuccess: () => void
  onClaim: () => Promise<ethers.providers.TransactionResponse>
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onDismiss }) => {
       // const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const plantContract = usePlant()
  const masterGardeningSchoolNftContract = useMasterGardeningSchoolNftContract()
  const masterGardeningSchoolNftContractAddress = getMasterGardeningSchoolNftAddress()
  const { toastError, toastSuccess } = useToast()

  const nftCost = new BigNumber(1000000000000000000)
  const nftApproval = new BigNumber(5).times(nftCost)
  
  const nftCostDisplay = nftCost.div(1000000000000000000)

  const hasMinimumPlantRequired = useHasPlantBalance(nftCost)

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        // TODO: Move this to a helper, this check will be probably be used many times
        try {
          const response = await plantContract.allowance(account, masterGardeningSchoolNftContractAddress)
          const currentAllowance = new BigNumber(response.toString())
          return currentAllowance.gte(nftApproval)
        } catch (error) {
          toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          return false
        }
      },
      onApprove: () => {
        return plantContract.approve(masterGardeningSchoolNftContractAddress, nftApproval.toJSON())
      },
      onConfirm: () => {
        return masterGardeningSchoolNftContract.mintNFT(nft.variationId)
      },
      onSuccess: () => {
        toastSuccess(t('Successfully claimed!'))
        onDismiss()
        onSuccess()
        return null
      },
    })
/*
  const plantAllowance = async () => { await plantContract.allowance(account, masterGardeningSchoolNftContractAddress) }

  const handleConfirm = async () => {
    const tx = await onClaim()
    setIsConfirming(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Successfully claimed!'))
      onDismiss()
      onSuccess()
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsConfirming(false)
    }
  }

  const handleApprove = () => {
    plantContract.approve(masterGardeningSchoolNftContractAddress, nftApproval.toJSON())
  } */
  /*
  const allowance = async () => {
    // TODO: Move this to a helper, this check will be probably be used many times
    try {
      const response = await plantContract.allowance(account, masterGardeningSchoolNftContractAddress)
      const currentAllowance = new BigNumber(response.toString())
      return currentAllowance.gte(nftCost)
    } catch (error) {
      return false
    }
  } */
    
  return (
    <Modal title={t('Claim Collectible')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="space-between">
          <Text>{t('You will receive')}:</Text>
          <Text bold>{t('1x %nftName% Collectible', { nftName: nft.name })}</Text>
        </Flex>
        <Flex alignItems="center" mb="8px" justifyContent="space-between">
          {!hasMinimumPlantRequired ? (
            <Text small color="warning">{t('Minimum plant required: %nftCost% PLANT', { nftCost: nftCostDisplay.toNumber() })}</Text>
          ) : (
            <Text small color="textSubtle">{t('Minting cost: %nftCost% PLANT', { nftCost: nftCostDisplay.toNumber() })} </Text>
          )}
        </Flex>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <ApproveConfirmButtons
            isApproveDisabled={nft.variationId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumPlantRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
