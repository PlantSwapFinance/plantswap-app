import { Contract, getAddress, ZeroAddress, BrowserProvider, JsonRpcSigner } from 'ethers'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import type { Currency } from '@pancakeswap/sdk'
import { Ether } from 'constants/ether'
import { ChainId, Percent, Token, CurrencyAmount } from '@pancakeswap/sdk'
import JSBI from 'jsbi'
import { ROUTER_ADDRESS } from '../config/constants'
import { BASE_BSC_SCAN_URLS } from '../config'
import { TokenAddressMap } from '../state/lists/hooks'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId: ChainId = ChainId.BSC,
): string {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[chainId]}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10% (native bigint arithmetic in ethers v6)
export function calculateGasMargin(value: bigint): bigint {
  return (value * (10000n + 1000n)) / 10000n
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: BrowserProvider, account: string): Promise<JsonRpcSigner> {
  // v6's BrowserProvider.getSigner returns a Promise — callers must await it
  // before passing the result into `new Contract(...)`.
  return library.getSigner(account)
}

// account is optional
export async function getProviderOrSigner(
  library: BrowserProvider,
  account?: string,
): Promise<BrowserProvider | JsonRpcSigner> {
  return account ? getSigner(library, account) : library
}

// account is optional — async because the signer must be resolved in ethers v6
export async function getContract(
  address: string,
  ABI: any,
  library: BrowserProvider,
  account?: string,
): Promise<Contract> {
  if (!isAddress(address) || address === ZeroAddress) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  const runner = await getProviderOrSigner(library, account)
  return new Contract(address, ABI, runner)
}

// account is optional
export async function getRouterContract(
  _: number,
  library: BrowserProvider,
  account?: string,
): Promise<Contract> {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === Ether) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}
