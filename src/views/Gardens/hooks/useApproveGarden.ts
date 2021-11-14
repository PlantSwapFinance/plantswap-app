import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useMasterchef } from 'hooks/useContract'

const useApproveGarden = (lpContract: Contract) => {
  const masterGardenerContract = useMasterchef()
  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(masterGardenerContract.address, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      return receipt.status
    } catch (e) {
      return false
    }
  }, [lpContract, masterGardenerContract])

  return { onApprove: handleApprove }
}

export default useApproveGarden
