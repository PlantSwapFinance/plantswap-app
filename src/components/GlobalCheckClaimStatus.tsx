import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useModal } from '@plantswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { useMasterGardeningSchoolNftContract } from 'hooks/useContract'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
  /**
   * The claim-check modal element, e.g. `<NftGiveawayModal />`. Rendered via
   * `useModal` when the contract reports a claim is available and the user is
   * not currently on an excluded path.
   */
  claimModal: React.ReactNode
}

/**
 * Polls the easter-NFT contract for the current account and surfaces a claim
 * modal when one is available, unless the user is currently on a path listed
 * in `excludeLocations`. Rendered as a component (rather than a hook) so it
 * can live inside the Router and read `useLocation()`.
 */
const GlobalCheckClaimStatus: React.FC<GlobalCheckClaimStatusProps> = ({ excludeLocations, claimModal }) => {
  const hasDisplayedModal = useRef(false)
  const [isClaimable, setIsClaimable] = useState(false)
  const [onPresentGiftModal] = useModal(claimModal)
  const easterNftContract = useMasterGardeningSchoolNftContract()
  const { profile } = useProfile()
  const { account } = useWeb3React()
  const { pathname } = useLocation()

  // Check claim status. setState is stable so it does not need to be in deps;
  // hooks/exhaustive-deps knows this.
  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaim = await easterNftContract.canClaim(account)
      setIsClaimable(canClaim)
    }

    if (account && profile) {
      fetchClaimStatus()
    }
  }, [easterNftContract, account, profile])

  // Decide whether to surface the modal. The ref itself never changes
  // identity, so excluding it from deps is intentional — we only re-evaluate
  // when pathname, isClaimable, or excludeLocations move.
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (isClaimable && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentGiftModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, isClaimable, excludeLocations, onPresentGiftModal])

  // Reset the displayed flag when the account changes.
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account])

  return null
}

export default GlobalCheckClaimStatus
