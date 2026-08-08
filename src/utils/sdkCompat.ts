import { CurrencyAmount } from '@pancakeswap/sdk'
import { Ether } from 'constants/ether'

/**
 * Bridge a few removed SDK v2 helpers used across the app onto SDK v5 types.
 * Import this once at app boot (see `src/index.tsx`).
 */

const CurrencyAmountAny = CurrencyAmount as typeof CurrencyAmount & {
  ether?: (amount: { toString(): string } | string | number | bigint) => CurrencyAmount<typeof Ether>
}

if (typeof CurrencyAmountAny.ether !== 'function') {
  CurrencyAmountAny.ether = (amount) => CurrencyAmount.fromRawAmount(Ether, amount.toString())
}

if (!Object.getOwnPropertyDescriptor(CurrencyAmount.prototype, 'raw')) {
  Object.defineProperty(CurrencyAmount.prototype, 'raw', {
    configurable: true,
    enumerable: false,
    get() {
      // Legacy code expects `.raw`; SDK v5 exposes the same value as `.quotient` (bigint).
      return this.quotient
    },
  })
}

if (!Object.getOwnPropertyDescriptor(CurrencyAmount.prototype, 'token')) {
  Object.defineProperty(CurrencyAmount.prototype, 'token', {
    configurable: true,
    enumerable: false,
    get() {
      // Legacy TokenAmount.token — only meaningful for token currencies.
      return this.currency?.isToken ? this.currency : undefined
    },
  })
}
