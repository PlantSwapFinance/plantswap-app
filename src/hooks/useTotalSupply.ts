import { Token, CurrencyAmount } from '@pancakeswap/sdk'
import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(token?: Token): CurrencyAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const totalSupply: bigint | undefined = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new CurrencyAmount(token, totalSupply.toString()) : undefined
}

export default useTotalSupply
