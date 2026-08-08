import type { Currency } from '@pancakeswap/sdk'
import { ChainId, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { Ether } from 'constants/ether'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  if (!currency || !chainId) return undefined
  if (currency.isNative) return currency.wrapped
  if (currency instanceof Token) return currency
  return undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined,
): CurrencyAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount
    ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient.toString())
    : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(Ether.wrapped)) return Ether
  return token
}
