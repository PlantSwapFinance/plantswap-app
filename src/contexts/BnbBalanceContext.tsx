import React, { createContext, useContext, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { FetchStatus } from 'hooks/useTokenBalance'
import { simpleRpcProvider } from 'utils/providers'

/**
 * Below this native balance a user may not be able to pay for even one approve, stake or swap.
 * An approval costs ~0.0002 BNB and a swap ~0.0005 BNB at typical BSC gas prices, so 0.002 BNB
 * leaves room for a couple of transactions.
 */
export const LOW_BNB_GAS_THRESHOLD = new BigNumber('2000000000000000') // 0.002 BNB in wei

interface BnbBalanceState {
  account?: string
  balance?: BigNumber
  fetchStatus: FetchStatus
}

const BnbBalanceContext = createContext<BnbBalanceState>({ fetchStatus: FetchStatus.NOT_FETCHED })

/**
 * Fetches the connected wallet's BNB balance once per fast refresh and shares it, so the many
 * farm and pool cards that show a low-gas notice do not each poll the RPC.
 */
export const BnbBalanceProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { account } = useActiveWeb3React()
  const { fastRefresh } = useRefresh()
  const [state, setState] = useState<BnbBalanceState>({ fetchStatus: FetchStatus.NOT_FETCHED })

  useEffect(() => {
    if (!account) return undefined
    let cancelled = false
    simpleRpcProvider
      .getBalance(account)
      .then((res) => {
        if (!cancelled) {
          setState({ account, balance: new BigNumber(res.toString()), fetchStatus: FetchStatus.SUCCESS })
        }
      })
      .catch(() => {
        // Keep the last good balance for this wallet so a flaky RPC does not flash the notice on and off.
        if (!cancelled) {
          setState((prev) =>
            prev.account === account && prev.balance ? prev : { account, fetchStatus: FetchStatus.FAILED },
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [account, fastRefresh])

  return <BnbBalanceContext.Provider value={state}>{children}</BnbBalanceContext.Provider>
}

/**
 * True only once the connected wallet's balance is known and below the gas threshold: never while
 * loading, on RPC failure, or with a balance left over from a previously connected wallet.
 */
export const useHasLowBnbBalance = () => {
  const { account } = useActiveWeb3React()
  const state = useContext(BnbBalanceContext)
  return (
    Boolean(account) &&
    state.account === account &&
    state.fetchStatus === FetchStatus.SUCCESS &&
    Boolean(state.balance?.lt(LOW_BNB_GAS_THRESHOLD))
  )
}
