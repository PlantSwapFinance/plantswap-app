import { useCallback } from 'react'
import { Contract, MaxUint256 } from 'ethers'
import { useMasterchef } from 'hooks/useContract'

const useApprovePool = (lpContract: Contract) => {
  const masterGardenerContract = useMasterchef()
  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(masterGardenerContract.address, MaxUint256)
      const receipt = await tx.wait()
      return receipt.status
    } catch (e) {
      return false
    }
  }, [lpContract, masterGardenerContract])

  return { onApprove: handleApprove }
}

export default useApprovePool
