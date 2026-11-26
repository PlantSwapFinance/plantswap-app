import { useCallback } from 'react'
import { fetchVerticalGardensUserDataAsync } from 'state/actions'
import { useVerticalGarden } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useVerticalGardensStore } from 'state/verticalGardens/store'
import { submitAndWait, OnTransactionSubmitted } from 'utils/calls'
import { VERTICALGARDEN_GAS_LIMIT } from 'config'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

const options = {
  gasLimit: BigInt(VERTICALGARDEN_GAS_LIMIT),
}

const harvestVerticalGarden = async (verticalGardenContract, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(verticalGardenContract.harvestGarden(options), onSubmitted)
}

const useVerticalGardenHarvest = (vgId) => {
  const { account } = useActiveWeb3React()
  const verticalGardenContract = useVerticalGarden(vgId)
  const addTransaction = useTransactionAdder()
  const stakingSymbol = useVerticalGardensStore(
    (state) => state.data.find((vg) => String(vg.vgId) === String(vgId))?.stakingToken?.symbol,
  )

  const handleHarvest = useCallback(async () => {
    await harvestVerticalGarden(verticalGardenContract, (tx) =>
      addTransaction(tx, { summary: `Harvest ${stakingSymbol ?? 'tokens'} Vertical Garden` }),
    )
    fetchVerticalGardensUserDataAsync(account).catch(console.error)
  }, [account, verticalGardenContract, addTransaction, stakingSymbol])

  return { onReward: handleHarvest }
}

export default useVerticalGardenHarvest
