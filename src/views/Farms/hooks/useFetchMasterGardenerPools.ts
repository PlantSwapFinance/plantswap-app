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

export interface FetchMasterGardenerPoolsResult {
  pools: MasterGardenerPool[]
  totalAllocPoint: string
  isLoading: boolean
  refresh: () => void
}

/**
 * Fetches every pool registered on the MasterGardener contract via `poolInfo(i)`,
 * using a single multicall for all pids after `poolLength()` resolves. Also
 * reads `totalAllocPoint()` so callers can show each pool's share of total
 * allocations.
 *
 * Used by the Manage modal to display the canonical on-chain state (independent
 * of the static `farmsConfig`), joined with `lpSymbol` from the config for
 * human-readable labels.
 *
 * Reads against the read-only `simpleRpcProvider` so it works before the user
 * connects a wallet. Re-runs when `chainId` changes or `refresh()` is called.
 */
const useFetchMasterGardenerPools = (): FetchMasterGardenerPoolsResult => {
  const { chainId } = useActiveWeb3React()
  const [pools, setPools] = useState<MasterGardenerPool[]>([])
  const [totalAllocPoint, setTotalAllocPoint] = useState('0')
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
          if (!cancelled) {
            setPools([])
            setTotalAllocPoint('0')
          }
          return
        }

        const calls = [
          ...Array.from({ length }, (_, pid) => ({
            address: getMasterGardenerAddress(),
            name: 'poolInfo',
            params: [pid],
          })),
          {
            address: getMasterGardenerAddress(),
            name: 'totalAllocPoint',
          },
        ]
        const results: any[] = await multicall(masterchefABI, calls)
        if (cancelled) return

        const poolResults = results.slice(0, length)
        const totalResult = results[length]

        const parsed: MasterGardenerPool[] = poolResults.map((info, pid) => ({
          pid,
          lpToken: (info.lpToken ?? info[0] ?? '').toString(),
          allocPoint: (info.allocPoint ?? info[1] ?? '0').toString(),
          depositFeeBP: Number((info.depositFeeBP ?? info[4] ?? 0).toString()),
          lastRewardBlock: Number((info.lastRewardBlock ?? info[2] ?? 0).toString()),
        }))
        setPools(parsed)
        setTotalAllocPoint((totalResult?.[0] ?? totalResult ?? '0').toString())
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('useFetchMasterGardenerPools: failed to read MasterGardener pools', error)
        if (!cancelled) {
          setPools([])
          setTotalAllocPoint('0')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchPools()
    return () => {
      cancelled = true
    }
  }, [chainId, refreshIndex])

  return { pools, totalAllocPoint, isLoading, refresh }
}

export default useFetchMasterGardenerPools