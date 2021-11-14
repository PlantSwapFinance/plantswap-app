import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  getBep20Contract,
  getPlantContract,
  getErc721Contract,
  getMasterchefContract,
  getVerticalGardenContract,
  getCollectiblesFarmContract,
  getCollectiblesFarmingPoolContract,
  getPlantswapGardenersContract,
  getFoundationNonProfitContract,
  getGardeningSchoolNftContract,
  getMasterGardeningSchoolNftContract,
  getPointsRewardSchoolNftContract,
  getSharePlantswapLoveSchoolNftContract,
  getProfileContract,
  getPlantswapMarketContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getSouschefContract,
  getPointCenterIfoContract,
  getChainlinkOracleContract,
} from 'utils/contractHelpers'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from '@pancakeswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import ENS_PUBLIC_RESOLVER_ABI from '../config/abi/ens-public-resolver.json'
import ENS_ABI from '../config/abi/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import WETH_ABI from '../config/abi/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../config/constants/multicall'
import { getContract } from '../utils'

// Plant token

export const usePlant = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPlantContract(library.getSigner()), [library])
}

// Farms and Gardens

export const useMasterchef = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getMasterchefContract(library.getSigner()), [library])
}

export const useVerticalGarden = (id) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getVerticalGardenContract(id, library.getSigner()), [id, library])
}

export const useCollectiblesFarm = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getCollectiblesFarmContract(library.getSigner()), [library])
}

export const useCollectiblesFarmingPool = (id) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getCollectiblesFarmingPoolContract(id, library.getSigner()), [id, library])
}

// GardenV1

export const useSousChef = (id) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSouschefContract(id, library.getSigner()), [id, library])
}

// Collectibles

export const usePlantswapGardeners = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPlantswapGardenersContract(library.getSigner()), [library])
}

// Foundations
export const useFoundationNonProfit = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getFoundationNonProfitContract(library.getSigner()), [library])
}

// Profile

export const useProfile = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getProfileContract(library.getSigner()), [library])
}

// Market
export const usePlantswapMarket = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPlantswapMarketContract(library.getSigner()), [library])
}

// Collectibles Claiming School

export const useGardeningSchoolNftContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getGardeningSchoolNftContract(library.getSigner()), [library])
}

export const useMasterGardeningSchoolNftContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getMasterGardeningSchoolNftContract(library.getSigner()), [library])
}

export const usePointsRewardSchoolNftContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPointsRewardSchoolNftContract(library.getSigner()), [library])
}

export const useSharePlantswapLoveSchoolNftContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSharePlantswapLoveSchoolNftContract(library.getSigner()), [library])
}

// Multicall and other basic abi

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBep20Contract(address, library.getSigner()), [address, library])
}
export const useERC721 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getErc721Contract(address, library.getSigner()), [address, library])
}

// Not used

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getIfoV1Contract(address, library.getSigner()), [address, library])
}

export const useIfoV2Contract = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getIfoV2Contract(address, library.getSigner()), [address, library])
}

export const usePointCenterIfoContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPointCenterIfoContract(library.getSigner()), [library])
}

export const useChainlinkOracleContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getChainlinkOracleContract(library.getSigner()), [library])
}

   //  const { account, library } = useActiveWeb3React()
  // This hook is slightly different from others
  // Calls were failing if unconnected user goes to farm auction page
  // Using library instead of library.getSigner() fixes the problem for unconnected users
  // However, this fix is not ideal, it currently has following behavior:
  // - If you visit Farm Auction page coming from some other page there are no errors in console (unconnceted or connected)
  // - If you go directly to Farm Auction page
  //   - as unconnected user you don't see any console errors
  //   - as connected user you see `unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION, ...` errors
  //     the functionality of the page is not affected, data is loading fine and you can interact with the contract
  //
  // Similar behavior was also noticed on Trading Competition page.
      // return useMemo(() => getFarmAuctionContract(account ? library.getSigner() : library), [library, account])

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}
