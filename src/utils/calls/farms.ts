import BigNumber from 'bignumber.js'
import type { TransactionResponse } from 'ethers'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

/**
 * Called as soon as the wallet returns a transaction response, before it is mined, so the
 * caller can register it in the persisted transaction store (hash, BscScan link, survives refresh).
 */
export type OnTransactionSubmitted = (tx: TransactionResponse) => void

/**
 * Notifies `onSubmitted` with the broadcast transaction, then waits for it to be mined.
 * In ethers v6 `tx.wait()` throws when the transaction reverts, so resolving means success.
 * Resolves to the transaction hash.
 */
export const submitAndWait = async (
  txPromise: Promise<TransactionResponse>,
  onSubmitted?: OnTransactionSubmitted,
): Promise<string> => {
  const tx = await txPromise
  onSubmitted?.(tx)
  await tx.wait()
  return tx.hash
}

export const stakeFarm = async (masterGardenerContract, pid, amount, onSubmitted?: OnTransactionSubmitted) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  return submitAndWait(masterGardenerContract.deposit(pid, value, options), onSubmitted)
}

export const unstakeFarm = async (masterGardenerContract, pid, amount, onSubmitted?: OnTransactionSubmitted) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  return submitAndWait(masterGardenerContract.withdraw(pid, value, options), onSubmitted)
}

export const harvestFarm = async (masterGardenerContract, pid, onSubmitted?: OnTransactionSubmitted) => {
  return submitAndWait(masterGardenerContract.deposit(pid, '0', options), onSubmitted)
}
