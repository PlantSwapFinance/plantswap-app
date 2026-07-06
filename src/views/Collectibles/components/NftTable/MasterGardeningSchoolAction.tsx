import React from 'react'
import useMasterGardeningSchoolClaimStatus from 'hooks/useMasterGardeningSchoolClaimStatus'
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
  const { variationId } = nft
  const { isClaimable, handleClaim } = useMasterGardeningSchoolClaimStatus(variationId)

  return <Action nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default MasterGardeningSchoolAction