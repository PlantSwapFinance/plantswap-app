import React from 'react'
import useMasterGardeningSchoolClaimStatus from 'hooks/useMasterGardeningSchoolClaimStatus'
import NftCard, { NftCardProps } from './index'

/**
 * A map of NFT bunny Ids to Team ids
 * [identifier]: teamId
 */
export const teamNftMap = {
  'relaxPlantFarmer': 1,
  'easter-flipper': 2,
  'easter-plantr': 3,
}

const MasterGardeningSchoolNftCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const { variationId } = nft
  // Wallet can claim if the contract says it can and the wallet's team matches the variation;
  // both checks live inside the hook.
  const { isClaimable, handleClaim } = useMasterGardeningSchoolClaimStatus(variationId)

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default MasterGardeningSchoolNftCard