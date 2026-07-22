import { Contract, TransactionResponse } from 'ethers'

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param gasMarginPer10000 The gasMargin per 10000 (i.e. 10% -> 1000)
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const estimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[],
  gasMarginPer10000: number,
) => {
  if (!contract[methodName]) {
    throw new Error(`Method ${methodName} doesn't exist on ${contract.address}`)
  }
  const rawGasEstimation: bigint = await contract[methodName].estimateGas(...methodArgs)
  // Multiply by the (10000 + margin) / 10000 ratio using native bigint arithmetic.
  const gasEstimation =
    (rawGasEstimation * (10000n + BigInt(gasMarginPer10000))) / 10000n
  return gasEstimation
}

/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const callWithEstimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
  gasMarginPer10000 = 1000,
): Promise<TransactionResponse> => {
  const gasEstimation = estimateGas(contract, methodName, methodArgs, gasMarginPer10000)
  const tx = await contract[methodName](...methodArgs, {
    gasLimit: gasEstimation,
  })
  return tx
}
