import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useProfile } from 'state/profile/hooks'
import { useMasterGardeningSchoolNftContract } from 'hooks/useContract'
import Action, { ActionProps } from './Action'

/**
 * A map of NFT bunny Ids to Team ids
 * [identifier]: teamId
 */
export const teamNftMap = {
  'relaxPlantFarmer': 1,
  'easter-flipper': 2,
  'easter-plantr': 3,
}

const MasterGardeningSchoolAction: React.FC<ActionProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const { identifier, variationId } = nft
  const { team } = profile ?? {}
  const masterGardeningSchoolNftContract = useMasterGardeningSchoolNftContract()

  const handleClaim = async () => {
    const response: ethers.providers.TransactionResponse = await masterGardeningSchoolNftContract.mintNFT(variationId)
    await response.wait()
    return response
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      // const canClaim = true
      const canClaim = await masterGardeningSchoolNftContract.canClaimSingle(account, variationId)

      // Wallet can claim if it is claimable and the nft being displayed is mapped to the wallet's team
      setIsClaimable(canClaim)
    }

    if (account && team) {
      fetchClaimStatus()
    }
  }, [account, identifier, variationId, team, masterGardeningSchoolNftContract, setIsClaimable])
 
  return <Action nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
} 

export default MasterGardeningSchoolAction
