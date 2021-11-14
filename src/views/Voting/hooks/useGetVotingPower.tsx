import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { getActivePools } from 'utils/calls'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'
import { getVotingPower } from '../helpers'

interface State {
  verificationHash: string
  plantBalance: BigNumber
  plantVaultBalance: BigNumber
  plantPoolBalance: BigNumber
  poolsBalance: BigNumber
  plantBnbLpBalance: BigNumber
  total: BigNumber
}

const initialState: State = {
  verificationHash: null,
  plantBalance: BIG_ZERO,
  plantVaultBalance: BIG_ZERO,
  plantPoolBalance: BIG_ZERO,
  poolsBalance: BIG_ZERO,
  plantBnbLpBalance: BIG_ZERO,
  total: BIG_ZERO,
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean } => {
  const { account } = useWeb3React()
  const [votingPower, setVotingPower] = useState(initialState)
  const [isLoading, setIsLoading] = useState(!!account)

  useEffect(() => {
    const fetchVotingPower = async () => {
      setIsLoading(true)

      try {
        const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
        const eligiblePools = await getActivePools(blockNumber)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
        const {
          plantBalance,
          plantBnbLpBalance,
          plantPoolBalance,
          total,
          poolsBalance,
          plantVaultBalance,
          verificationHash,
        } = await getVotingPower(account, poolAddresses, blockNumber)

        if (isActive) {
          setVotingPower((prevVotingPower) => ({
            ...prevVotingPower,
            verificationHash,
            plantBalance: new BigNumber(plantBalance),
            plantBnbLpBalance: new BigNumber(plantBnbLpBalance),
            plantPoolBalance: new BigNumber(plantPoolBalance),
            poolsBalance: new BigNumber(poolsBalance),
            plantVaultBalance: new BigNumber(plantVaultBalance),
            total: new BigNumber(total),
          }))
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (account && isActive) {
      fetchVotingPower()
    }
  }, [account, block, setVotingPower, isActive, setIsLoading])

  return { ...votingPower, isLoading }
}

export default useGetVotingPower
