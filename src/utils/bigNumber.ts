import BigNumber from 'bignumber.js'
import { SerializedBigNumber } from 'state/types'

export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)

export const ethersToSerializedBigNumber = (ethersBn: bigint): SerializedBigNumber =>
  ethersToBigNumber(ethersBn).toJSON()

export const ethersToBigNumber = (ethersBn: bigint): BigNumber => new BigNumber(ethersBn.toString())

/**
 * Coerce multicall / ethers v6 Result values into a BigNumber.
 * Passing a Result object directly throws: BigNumber rejects array-like objects.
 */
export const toBigNumber = (value: unknown): BigNumber => {
  if (value === null || value === undefined) {
    return BIG_ZERO
  }
  if (BigNumber.isBigNumber(value)) {
    return value
  }
  // ethers Result is array-like; unwrap the first return value
  if (typeof value === 'object' && value !== null && '0' in (value as object)) {
    return toBigNumber((value as { 0: unknown })[0])
  }
  if (typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string') {
    return new BigNumber(value.toString())
  }
  if (typeof (value as { toString?: () => string }).toString === 'function') {
    return new BigNumber((value as { toString: () => string }).toString())
  }
  return BIG_ZERO
}

export const toSerializedBigNumber = (value: unknown): SerializedBigNumber => toBigNumber(value).toJSON()
