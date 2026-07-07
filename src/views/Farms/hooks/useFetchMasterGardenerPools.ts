import { useEffect, useState, useCallback } from 'react'
import masterchefABI from 'config/abi/mastergardener.json'
import { getMasterGardenerAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import { getMasterchefContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export interface MasterGardenerPool {
  pid: number
  lpToken: string
  allocPoint: string
  depositFeeBP: number
  lastRewardBlock: number
}

/**
 * Fetches every pool registered on the MasterGardener contract via `poolInfo(i)`,
 * using a single multicall for all pids after `poolLength()` resolves.
 *
 * Used by the Manage modal to display the canonical on-chain state (independent
 * of the static `farmsConfig`), joined with `lpSymbol` from the config for
 * human-readable labels.
 *
 * Reads against the read-only `simpleRpcProvider` so it works before the user
 * connects a wallet. Re-runs when `chainId` changes or `refresh()` is called.
 */
const useFetchMasterGardenerPools = () => {
  const { chainId } = useActiveWeb3React()
  const [pools, setPools] = useState<MasterGardenerPool[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const refresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchPools = async () => {
      setIsLoading(true)
      try {
        const readContract = getMasterchefContract(simpleRpcProvider)
        const lengthBn = await readContract.poolLength()
        const length = Number(lengthBn.toString())

        if (length === 0) {
          if (!cancelled) setPools([])
          return
        }

        const calls = Array.from({ length }, (_, pid) => ({
          address: getMasterGardenerAddress(),
          name: 'poolInfo',
          params: [pid],
        }))
        const results: any[] = await multicall(masterchefABI, calls)

        if (cancelled) return
        const parsed: MasterGardenerPool[] = results.map((info, pid) => ({
          pid,
          lpToken: (info.lpToken ?? info[0] ?? '').toString(),
          allocPoint: (info.allocPoint ?? info[1] ?? '0').toString(),
          depositFeeBP: Number((info.depositFeeBP ?? info[4] ?? 0).toString()),
          lastRewardBlock: Number((info.lastRewardBlock ?? info[2] ?? 0).toString()),
        }))
        setPools(parsed)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('useFetchMasterGardenerPools: failed to read MasterGardener pools', error)
        if (!cancelled) setPools([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchPools()
    return () => {
      cancelled = true
    }
  }, [chainId, refreshIndex])

  return { pools, isLoading, refresh }
}

export default useFetchMasterGardenerPools