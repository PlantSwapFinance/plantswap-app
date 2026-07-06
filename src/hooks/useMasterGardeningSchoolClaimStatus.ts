import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/profile/hooks'
import { useMasterGardeningSchoolNftContract } from './useContract'

/**
 * Reads `canClaimSingle(account, variationId)` from the MasterGardeningSchool
 * NFT contract for the connected wallet, and exposes a `handleClaim` helper
 * that calls `mintNFT(variationId)` and waits for the receipt.
 *
 * The fetch is gated on both a connected account and a loaded profile (the
 * profile carries the team that the contract checks against). Callers should
 * treat `isClaimable` as `false` until both are ready.
 */
const useMasterGardeningSchoolClaimStatus = (variationId: number | null) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const { team } = profile ?? {}
  const masterGardeningSchoolNftContract = useMasterGardeningSchoolNftContract()

  const handleClaim = useCallback(async () => {
    if (variationId === null) {
      throw new Error('useMasterGardeningSchoolClaimStatus: cannot claim with a null variationId')
    }
    const response: ethers.providers.TransactionResponse = await masterGardeningSchoolNftContract.mintNFT(variationId)
    await response.wait()
    return response
  }, [masterGardeningSchoolNftContract, variationId])

  const refresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const fetchClaimStatus = async () => {
      if (variationId === null) {
        setIsClaimable(false)
        return
      }
      const canClaim = await masterGardeningSchoolNftContract.canClaimSingle(account, variationId)
      setIsClaimable(canClaim)
    }

    if (account && team && variationId !== null) {
      fetchClaimStatus()
    }
  }, [account, variationId, team, masterGardeningSchoolNftContract, refreshIndex])

  return { isClaimable, handleClaim, refresh }
}

export default useMasterGardeningSchoolClaimStatus