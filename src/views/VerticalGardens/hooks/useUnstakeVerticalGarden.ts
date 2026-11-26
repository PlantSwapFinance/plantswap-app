import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { fetchVerticalGardensUserDataAsync } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { BIG_TEN } from 'utils/bigNumber'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const verticalUnstake = async (verticalGardenContract, amount, decimals) => {
  const tx = await verticalGardenContract.withdraw(
    new BigNumber(amount).times(BIG_TEN.pow(decimals)).integerValue(BigNumber.ROUND_DOWN).toFixed(),
  )
  const receipt = await tx.wait()
  return receipt.status
}

const useUnstakeVerticalGarden = (vgId) => {
  const { account } = useActiveWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      await verticalUnstake(verticalGardenContract, amount, decimals)

      fetchVerticalGardensUserDataAsync(account).catch(console.error)
    },
    [account, verticalGardenContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeVerticalGarden
