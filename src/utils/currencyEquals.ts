import type { Currency } from '@pancakeswap/sdk'
import { Token } from '@pancakeswap/sdk'
/**
 * Compares two Currencies for equality, handling both native currencies
 * (Ether / chain-native) and ERC20 tokens. The legacy `currencyEquals`
 * helper was removed from `@pancakeswap/sdk` in v5.
 */
export default function currencyEquals(a: Currency, b: Currency): boolean {
  if (a.isToken && b.isToken) {
    return (a as Token).equals(b as Token)
  }
  if (a.isNative || b.isNative) {
    return a.isNative === b.isNative && a.chainId === b.chainId
  }
  return false
}