import type { Currency } from '@pancakeswap/sdk'
import { Ether } from 'constants/ether'
import { Token } from '@pancakeswap/sdk'
export function currencyId(currency: Currency): string {
  if (currency === Ether || currency.isNative) return 'BNB'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
