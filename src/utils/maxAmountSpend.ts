import { CurrencyAmount } from '@pancakeswap/sdk'
import { MIN_BNB } from '../config/constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency.isNative) {
    const amount = currencyAmount.quotient
    const min = BigInt(MIN_BNB.toString())
    if (amount > min) {
      return CurrencyAmount.fromRawAmount(currencyAmount.currency, (amount - min).toString())
    }
    return CurrencyAmount.fromRawAmount(currencyAmount.currency, '0')
  }
  return currencyAmount
}

export default maxAmountSpend
