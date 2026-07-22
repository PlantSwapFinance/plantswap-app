import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import { getLanguageCodeFromLS } from 'contexts/Localization/helpers'
import { BIG_TEN } from './bigNumber'

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals))
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString(undefined, options)
}

/**
 * Method to format the display of wei given a native bigint (or bigintish) value.
 * Note: does NOT round.
 */
export const formatBigNumber = (number: bigint, displayDecimals = 18, decimals = 18) => {
  const divisor = 10n ** BigInt(decimals - displayDecimals)
  const remainder = number % divisor
  return formatUnits(number - remainder, decimals)
}

/**
 * Method to format the display of wei given a native bigint (or bigintish) value with toFixed.
 * Note: rounds.
 */
export const formatBigNumberToFixed = (number: bigint, displayDecimals = 18, decimals = 18) => {
  const formattedString = formatUnits(number, decimals)
  return (+formattedString).toFixed(displayDecimals)
}

/**
 * Formats a FixedNumber-like decimal string by stripping the fractional part,
 * then delegates to formatBigNumber.
 * e.g. "9763410526137450427.1196" becomes "9763410526137450427" then 9.763 (3 display decimals).
 */
export const formatFixedNumber = (number: string, displayDecimals = 18, decimals = 18) => {
  // Remove decimal
  const [leftSide] = number.split('.')
  return formatBigNumber(BigInt(leftSide), displayDecimals, decimals)
}

export const formatLocalisedCompactNumber = (number: number): string => {
  const codeFromStorage = getLanguageCodeFromLS()
  return new Intl.NumberFormat(codeFromStorage, {
    notation: 'compact',
    compactDisplay: 'long',
    maximumSignificantDigits: 2,
  }).format(number)
}

export default formatLocalisedCompactNumber
