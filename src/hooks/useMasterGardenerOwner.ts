import { useEffect, useState, useCallback } from 'react'
import { getMasterchefContract } from 'utils/contractHelpers'
import { simpleRpcProvider } from 'utils/providers'
import useActiveWeb3React from './useActiveWeb3React'
import useRefresh from './useRefresh'

/**
 * Reads `owner()` from the MasterGardener contract on-chain and compares it to
 * the connected wallet. Used to gate admin-only UI on Farms, Gardens, and
 * Vertical Gardens pages.
 *
 * The read is performed against the read-only `simpleRpcProvider` so it works
 * before the user connects a wallet. The result is re-fetched on every
 * `slowRefresh` tick so the Manage button disappears if ownership is
 * transferred while the page is open.
 *
 * On any RPC error the hook returns `isOwner=false` and logs to the console;
 * the page must not surface privileged UI on a failed check.
 */
const useMasterGardenerOwner = () => {
  const { account, chainId } = useActiveWeb3React()
  const { slowRefresh } = useRefresh()
  const [owner, setOwner] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const refresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchOwner = async () => {
      setIsLoading(true)
      try {
        const contract = getMasterchefContract(simpleRpcProvider)
        const ownerAddress: string = await contract.owner()
        if (!cancelled) setOwner(ownerAddress)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('useMasterGardenerOwner: failed to read MasterGardener.owner()', error)
        if (!cancelled) setOwner(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchOwner()
    return () => {
      cancelled = true
    }
  }, [chainId, slowRefresh, refreshIndex])

  const isOwner =
    !!account && !!owner && account.toLowerCase() === owner.toLowerCase()

  return { owner, isLoading, isOwner, refresh }
}

export default useMasterGardenerOwner