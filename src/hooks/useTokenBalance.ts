import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getBep20Contract, getPlantContract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from './useRefresh'
import useLastUpdated from './useLastUpdated'
import useActiveWeb3React from './useActiveWeb3React'

type UseTokenBalanceState = {
  balance: BigNumber
  fetchStatus: FetchStatus
}

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const useTokenBalance = (tokenAddress: string) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  const { account } = useActiveWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress)
      try {
        const res = await contract.balanceOf(account)
        setBalanceState({ balance: new BigNumber(res.toString()), fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

type UseOnChainAmountState = {
  /** Last successfully fetched amount; undefined until the first fetch succeeds */
  value?: BigNumber
  fetchStatus: FetchStatus
}

/**
 * Polls an on-chain amount on every slow refresh. Keeps the last good value when a later
 * refresh fails so the UI does not flicker back to a loading/failed state.
 */
const useSlowRefreshAmount = (fetcher: () => Promise<bigint>, deps: unknown[]): UseOnChainAmountState => {
  const { slowRefresh } = useRefresh()
  const [state, setState] = useState<UseOnChainAmountState>({ fetchStatus: FetchStatus.NOT_FETCHED })

  useEffect(() => {
    let cancelled = false
    fetcher()
      .then((res) => {
        if (!cancelled) setState({ value: new BigNumber(res.toString()), fetchStatus: FetchStatus.SUCCESS })
      })
      .catch((e) => {
        console.error(e)
        if (!cancelled) {
          setState((prev) => (prev.value ? prev : { value: undefined, fetchStatus: FetchStatus.FAILED }))
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slowRefresh, ...deps])

  return state
}

export const useTotalSupply = () => {
  const { value, fetchStatus } = useSlowRefreshAmount(() => getPlantContract().totalSupply(), [])
  return { totalSupply: value, fetchStatus }
}

export const useBurnedBalance = (tokenAddress: string) => {
  const { value, fetchStatus } = useSlowRefreshAmount(
    () => getBep20Contract(tokenAddress).balanceOf('0x000000000000000000000000000000000000dEaD'),
    [tokenAddress],
  )
  return { balance: value, fetchStatus }
}

export const useGetBnbBalance = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useActiveWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await simpleRpcProvider.getBalance(account)
        setBalance(new BigNumber(walletBalance.toString()))
        setFetchStatus(FetchStatus.SUCCESS)
      } catch {
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, lastUpdated, setBalance, setFetchStatus])

  return { balance, fetchStatus, refresh: setLastUpdated }
}

export default useTokenBalance
