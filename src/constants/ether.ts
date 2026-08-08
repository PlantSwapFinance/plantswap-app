import { ChainId, Native } from '@pancakeswap/sdk'

/**
 * BSC native BNB currency.
 *
 * Older Pancake SDKs exposed a singleton `Ether` / `ETHER` for the chain native
 * asset. SDK v5 removed that and requires `Native.onChain(chainId)`.
 * PlantSwap is BSC-only, so this constant restores the previous identity checks
 * (`currency === Ether`) used throughout the app.
 */
export const Ether = Native.onChain(ChainId.BSC)

export default Ether
