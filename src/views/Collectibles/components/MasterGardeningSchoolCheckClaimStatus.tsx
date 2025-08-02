import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useModal } from '@plantswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { useMasterGardeningSchoolNftContract } from 'hooks/useContract'
import NftMasterGardeningSchoolModal from './NftMasterGardeningSchoolModal'

interface MasterGardeningSchoolCheckClaimStatusProps {
  excludeLocations: string[]
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const MasterGardeningSchoolCheckClaimStatus: React.FC<MasterGardeningSchoolCheckClaimStatusProps> = ({ excludeLocations }) => {
  const hasDisplayedModal = useRef(false)
  const [isClaimable, setIsClaimable] = useState(false)
  const [onPresentGiftModal] = useModal(<NftMasterGardeningSchoolModal />)
  const masterGardeningSchoolNftContract = useMasterGardeningSchoolNftContract()
  const { profile } = useProfile()
  const { address: account } = useAccount()
  const { pathname } = useLocation()

  const variationId = 100

  // Check claim status
  useEffect(() => {
    const fetchClaimStatus = async () => {
     // const canClaim = await masterGardeningSchoolNftContract.canClaimSingle(100, account)
      const canClaim = false
      setIsClaimable(canClaim)
    }

    // Wait until we have a profile
    if (account && profile) {
      fetchClaimStatus()
    }
  }, [masterGardeningSchoolNftContract, account, variationId, profile, setIsClaimable])

  // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (isClaimable && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentGiftModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, isClaimable, excludeLocations, hasDisplayedModal, onPresentGiftModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default MasterGardeningSchoolCheckClaimStatus
