import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { callWithEstimateGas } from './estimateGas'

const options = {
  fallbackGasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterGardenerContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await callWithEstimateGas(masterGardenerContract, 'deposit', [pid, value], options)
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterGardenerContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await callWithEstimateGas(masterGardenerContract, 'withdraw', [pid, value], options)
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterGardenerContract, pid) => {
  const tx = await callWithEstimateGas(masterGardenerContract, 'deposit', [pid, '0'], options)
  const receipt = await tx.wait()
  return receipt.status
}
