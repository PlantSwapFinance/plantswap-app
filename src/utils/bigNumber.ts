import BigNumber from 'bignumber.js'
import { SerializedBigNumber } from 'state/types'

export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)

export const ethersToSerializedBigNumber = (ethersBn: bigint): SerializedBigNumber =>
  ethersToBigNumber(ethersBn).toJSON()

export const ethersToBigNumber = (ethersBn: bigint): BigNumber => new BigNumber(ethersBn.toString())
