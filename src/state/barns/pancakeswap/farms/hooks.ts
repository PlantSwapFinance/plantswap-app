import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { farmsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, nonArchivedFarms } from '.'
import { State, BarnPancakeswapFarm, BarnPancakeswapFarmsState } from '../../../types'

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { address: account } = useAccount()

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([252, 251]))
  }, [dispatch, fastRefresh])
}

export const useFarms = (): BarnPancakeswapFarmsState => {
  const barnPancakeswapFarms = useSelector((state: State) => state.barnPancakeswapFarms)
  return barnPancakeswapFarms
}

export const useFarmFromPid = (pid): BarnPancakeswapFarm => {
  const barnPancakeswapFarm = useSelector((state: State) => state.barnPancakeswapFarms.data.find((f) => f.pid === pid))
  return barnPancakeswapFarm
}

export const useFarmFromLpSymbol = (lpSymbol: string): BarnPancakeswapFarm => {
  const barnPancakeswapFarm = useSelector((state: State) => state.barnPancakeswapFarms.data.find((f) => f.lpSymbol === lpSymbol))
  return barnPancakeswapFarm
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

// Return the base token price for a barnPancakeswapFarm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const barnPancakeswapFarm = useFarmFromPid(pid)
  return barnPancakeswapFarm && new BigNumber(barnPancakeswapFarm.token.busdPrice)
}

export const useLpTokenPrice = (symbol: string) => {
  const barnPancakeswapFarm = useFarmFromLpSymbol(symbol)
  const barnPancakeswapFarmTokenPriceInUsd = useBusdPriceFromPid(barnPancakeswapFarm.pid)
  let lpTokenPrice = BIG_ZERO

  if (barnPancakeswapFarm.lpTotalSupply && barnPancakeswapFarm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = barnPancakeswapFarmTokenPriceInUsd.times(barnPancakeswapFarm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(barnPancakeswapFarm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// /!\ Deprecated , use the BUSD hook in /hooks

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(252)
  return new BigNumber(bnbBusdFarm.token.busdPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  const plantBnbFarm = useFarmFromPid(251)
  return new BigNumber(plantBnbFarm.token.busdPrice)
}
