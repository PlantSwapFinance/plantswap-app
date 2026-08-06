import type { Currency } from '@pancakeswap/sdk'
import { ChainId, Price, WETH9 } from '@pancakeswap/sdk'
import currencyEquals from './../utils/currencyEquals'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BUSD, CAKE } from '../config/constants/tokens'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const BUSD_MAINNET = BUSD[ChainId.BSC]

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH9[chainId], wrapped) ? undefined : currency,
        chainId ? WETH9[chainId] : undefined,
      ],
      [wrapped?.equals(BUSD_MAINNET) ? undefined : wrapped, chainId === ChainId.BSC ? BUSD_MAINNET : undefined],
      [chainId ? WETH9[chainId] : undefined, chainId === ChainId.BSC ? BUSD_MAINNET : undefined],
    ],
    [chainId, currency, wrapped],
  )
  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH9[chainId])) {
      if (busdPair) {
        const price = busdPair.priceOf(WETH9[chainId])
        return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(BUSD_MAINNET)) {
      return new Price(BUSD_MAINNET, BUSD_MAINNET, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH9[chainId])
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WETH9[chainId]).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(BUSD_MAINNET).greaterThan(ethPairETHBUSDValue)
    ) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(BUSD_MAINNET).greaterThan('0') && ethPair.reserveOf(WETH9[chainId]).greaterThan('0')) {
        const ethBusdPrice = busdEthPair.priceOf(BUSD_MAINNET)
        const currencyEthPrice = ethPair.priceOf(WETH9[chainId])
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, BUSD_MAINNET, busdPrice.denominator, busdPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const usePlantBusdPrice = (): Price | undefined => {
  const { chainId } = useActiveWeb3React()
  const currentChaindId = chainId || ChainId.BSC
  const plantBusdPrice = useBUSDPrice(CAKE[currentChaindId])
  return plantBusdPrice
}
