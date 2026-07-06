import { useMemo } from 'react'
import { ethers } from 'ethers'
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
  getSouschefContract,
  getPointCenterIfoContract,
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
import { getContract, getSigner } from '../utils'

type SignerArg = ethers.Signer | ethers.providers.Provider

/**
 * Returns a contract bound to a signer when the user is connected, or to the
 * provider (simpleRpcProvider fallback when no wallet) when they're not.
 *
 * Avoids the `UNSUPPORTED_OPERATION` error that fires from
 * `library.getSigner()` on direct page loads for disconnected users, and keeps
 * read-only calls working before wallet connection. Write methods on the
 * returned contract will throw when there's no signer — that's intentional,
 * because every write path in the app is gated behind a connected-wallet UI.
 *
 * The getter must accept `signerOrProvider` as its final argument, matching the
 * shape of the helpers in `src/utils/contractHelpers.ts`.
 */
function useContractWithOptionalSigner<A extends unknown[], R>(
  getContractFn: (...args: [...A, SignerArg]) => R,
  ...args: A
): R {
  const { library, account } = useActiveWeb3React()

  const signerOrProvider = useMemo(
    () => (account ? getSigner(library, account) : library),
    [library, account],
  )

  return useMemo(() => getContractFn(...args, signerOrProvider as SignerArg), [signerOrProvider, ...args])
}

// Plant token

export const usePlant = () => useContractWithOptionalSigner(getPlantContract)

// Farms and Gardens

export const useMasterchef = () => useContractWithOptionalSigner(getMasterchefContract)

export const useVerticalGarden = (id: number) => useContractWithOptionalSigner(getVerticalGardenContract, id)

export const useCollectiblesFarm = () => useContractWithOptionalSigner(getCollectiblesFarmContract)

export const useCollectiblesFarmingPool = (id: number) =>
  useContractWithOptionalSigner(getCollectiblesFarmingPoolContract, id)

// GardenV1

export const useSousChef = (id: number) => useContractWithOptionalSigner(getSouschefContract, id)

// Collectibles

export const usePlantswapGardeners = () => useContractWithOptionalSigner(getPlantswapGardenersContract)

// Foundations
export const useFoundationNonProfit = () => useContractWithOptionalSigner(getFoundationNonProfitContract)

// Profile

export const useProfile = () => useContractWithOptionalSigner(getProfileContract)

// Market
export const usePlantswapMarket = () => useContractWithOptionalSigner(getPlantswapMarketContract)

// Collectibles Claiming School

export const useGardeningSchoolNftContract = () => useContractWithOptionalSigner(getGardeningSchoolNftContract)

export const useMasterGardeningSchoolNftContract = () =>
  useContractWithOptionalSigner(getMasterGardeningSchoolNftContract)

export const usePointsRewardSchoolNftContract = () => useContractWithOptionalSigner(getPointsRewardSchoolNftContract)

export const useSharePlantswapLoveSchoolNftContract = () =>
  useContractWithOptionalSigner(getSharePlantswapLoveSchoolNftContract)

// Multicall and other basic abi

export const useERC20 = (address: string) => useContractWithOptionalSigner(getBep20Contract, address)

export const useERC721 = (address: string) => useContractWithOptionalSigner(getErc721Contract, address)

// Live contracts not tied to the multicall/ABIv2 path

export const usePointCenterIfoContract = () => useContractWithOptionalSigner(getPointCenterIfoContract)

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
