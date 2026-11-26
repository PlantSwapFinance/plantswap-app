import { BigNumberish, Contract, Overrides, TransactionResponse } from 'ethers'

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param methodArgs An array of arguments to pass to the method
 * @param gasMarginPer10000 The gasMargin per 10000 (i.e. 10% -> 1000)
 * @param overrides Transaction overrides (e.g. `value`) that affect the estimation
 * @returns The estimated gas limit, margin included
 */
export const estimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[],
  gasMarginPer10000: number,
  overrides: Overrides & { value?: BigNumberish } = {},
): Promise<bigint> => {
  if (!contract[methodName]) {
    throw new Error(`Method ${methodName} doesn't exist on ${String(contract.target)}`)
  }
  const rawGasEstimation: bigint = await contract[methodName].estimateGas(...methodArgs, overrides)
  // Multiply by the (10000 + margin) / 10000 ratio using native bigint arithmetic.
  const gasEstimation = (rawGasEstimation * (10000n + BigInt(gasMarginPer10000))) / 10000n
  return gasEstimation
}

export interface CallWithEstimateGasOptions {
  /** Gas margin per 10000 added on top of the estimation (i.e. 10% -> 1000) */
  gasMarginPer10000?: number
  /**
   * Gas limit used when the estimation fails (e.g. flaky RPC). When omitted, the estimation error is thrown.
   * The wallet still simulates the transaction before signing, so a call that would revert is surfaced there.
   */
  fallbackGasLimit?: BigNumberish
  /** Extra transaction overrides (e.g. `value`), forwarded to both the estimation and the call */
  overrides?: Overrides & { value?: BigNumberish }
}

/**
 * Perform a contract call with a gas value returned from estimateGas,
 * falling back to a fixed gas limit if the estimation fails.
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param methodArgs An array of arguments to pass to the method
 * @returns https://docs.ethers.org/v6/api/providers/#TransactionResponse
 */
export const callWithEstimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
  { gasMarginPer10000 = 1000, fallbackGasLimit, overrides = {} }: CallWithEstimateGasOptions = {},
): Promise<TransactionResponse> => {
  let gasLimit: BigNumberish
  try {
    gasLimit = await estimateGas(contract, methodName, methodArgs, gasMarginPer10000, overrides)
  } catch (error) {
    if (fallbackGasLimit === undefined) {
      throw error
    }
    console.warn(`Gas estimation failed for ${methodName}, using fallback gas limit ${fallbackGasLimit}`, error)
    gasLimit = fallbackGasLimit
  }
  const tx = await contract[methodName](...methodArgs, {
    ...overrides,
    gasLimit,
  })
  return tx
}
