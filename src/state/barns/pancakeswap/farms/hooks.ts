import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { farmsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import {
  fetchFarmUserData,
  fetchFarmsPublicData,
  nonArchivedFarms,
  useBarnPancakeswapFarmsStore,
} from './store'
import { BarnPancakeswapFarm, BarnPancakeswapFarmsState } from '../../../types'

export const usePollFarmsData = (includeArchive = false) => {
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    fetchFarmsPublicData(pids)

    if (account) {
      fetchFarmUserData({ account, pids })
    }
  }, [includeArchive, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    fetchFarmsPublicData([252, 251])
  }, [fastRefresh])
}

export const useFarms = (): BarnPancakeswapFarmsState => {
  return useBarnPancakeswapFarmsStore()
}

export const useFarmFromPid = (pid): BarnPancakeswapFarm => {
  return useBarnPancakeswapFarmsStore((state) => state.data.find((f) => f.pid === pid))
}

export const useFarmFromLpSymbol = (lpSymbol: string): BarnPancakeswapFarm => {
  return useBarnPancakeswapFarmsStore((state) => state.data.find((f) => f.lpSymbol === lpSymbol))
}

export const useFarmUser = (pid) => {
  const barnPancakeswapFarm = useFarmFromPid(pid)

  return {
    allowance: barnPancakeswapFarm.userData ? new BigNumber(barnPancakeswapFarm.userData.allowance) : BIG_ZERO,
    tokenBalance: barnPancakeswapFarm.userData ? new BigNumber(barnPancakeswapFarm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: barnPancakeswapFarm.userData ? new BigNumber(barnPancakeswapFarm.userData.stakedBalance) : BIG_ZERO,
    earnings: barnPancakeswapFarm.userData ? new BigNumber(barnPancakeswapFarm.userData.earnings) : BIG_ZERO,
  }
}

export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const barnPancakeswapFarm = useFarmFromPid(pid)
  return barnPancakeswapFarm && new BigNumber(barnPancakeswapFarm.token.busdPrice)
}

export const useLpTokenPrice = (symbol: string) => {
  const barnPancakeswapFarm = useFarmFromLpSymbol(symbol)
  const barnPancakeswapFarmTokenPriceInUsd = useBusdPriceFromPid(barnPancakeswapFarm.pid)
  let lpTokenPrice = BIG_ZERO

  if (barnPancakeswapFarm.lpTotalSupply && barnPancakeswapFarm.lpTotalInQuoteToken) {
    const valueOfBaseTokenInFarm = barnPancakeswapFarmTokenPriceInUsd.times(barnPancakeswapFarm.tokenAmountTotal)
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    const totalLpTokens = getBalanceAmount(new BigNumber(barnPancakeswapFarm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(252)
  return new BigNumber(bnbBusdFarm.token.busdPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  const plantBnbFarm = useFarmFromPid(251)
  return new BigNumber(plantBnbFarm.token.busdPrice)
}