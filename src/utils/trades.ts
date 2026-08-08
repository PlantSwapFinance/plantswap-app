import { Trade, Percent } from '@pancakeswap/sdk'
import currencyEquals from './currencyEquals'
import { ZERO_PERCENT, ONE_HUNDRED_PERCENT } from '../config/constants/index'

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
  tradeA: Trade | undefined | null,
  tradeB: Trade | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT,
): boolean | undefined {
  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable')
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice)
  }

  // SDK v5 Price no longer has `.raw`; compare via Fraction math instead.
  // Price.multiply() only accepts another Price, so use asFraction for the delta scale.
  return tradeA.executionPrice.asFraction
    .multiply(minimumDelta.add(ONE_HUNDRED_PERCENT))
    .lessThan(tradeB.executionPrice)
}

export default isTradeBetter
