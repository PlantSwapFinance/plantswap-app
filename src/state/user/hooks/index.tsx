import { Pair, Token } from '@pancakeswap/sdk'
import flatMap from 'lodash/flatMap'
import { useCallback, useMemo } from 'react'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllTokens } from 'hooks/Tokens'
import {
  addSerializedPair,
  addSerializedToken,
  muteAudio,
  removeSerializedToken,
  SerializedPair,
  toggleTheme as toggleThemeAction,
  unmuteAudio,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  useUserStore,
} from '../store'
import { serializeToken, deserializeToken } from './helpers'

export function useAudioModeManager(): [boolean, () => void] {
  const audioPlay = useUserStore((state) => state.audioPlay)

  const toggleSetAudioMode = useCallback(() => {
    if (audioPlay) {
      muteAudio()
    } else {
      unmuteAudio()
    }
  }, [audioPlay])

  return [audioPlay, toggleSetAudioMode]
}

export function useIsExpertMode(): boolean {
  return useUserStore((state) => state.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    updateUserExpertMode({ userExpertMode: !expertMode })
  }, [expertMode])

  return [expertMode, toggleSetExpertMode]
}

export function useThemeManager(): [boolean, () => void] {
  const isDark = useUserStore((state) => state.isDark)

  const toggleTheme = useCallback(() => {
    toggleThemeAction()
  }, [])

  return [isDark, toggleTheme]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const singleHopOnly = useUserStore((state) => state.userSingleHopOnly)

  const setSingleHopOnly = useCallback((newSingleHopOnly: boolean) => {
    updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly })
  }, [])

  return [singleHopOnly, setSingleHopOnly]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const userSlippageTolerance = useUserStore((state) => state.userSlippageTolerance)

  const setUserSlippageTolerance = useCallback((slippage: number) => {
    updateUserSlippageTolerance({ userSlippageTolerance: slippage })
  }, [])

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const userDeadline = useUserStore((state) => state.userDeadline)

  const setUserDeadline = useCallback((deadline: number) => {
    updateUserDeadline({ userDeadline: deadline })
  }, [])

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  return useCallback((token: Token) => {
    addSerializedToken({ serializedToken: serializeToken(token) })
  }, [])
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  return useCallback((chainId: number, address: string) => {
    removeSerializedToken({ chainId, address })
  }, [])
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  }
}

export function usePairAdder(): (pair: Pair) => void {
  return useCallback((pair: Pair) => {
    addSerializedPair({ serializedPair: serializePair(pair) })
  }, [])
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'Plant-LP', 'Plant LPs')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            return (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
              .map((base) => {
                if (base.address === token.address) {
                  return null
                }
                return [base, token]
              })
              .filter((p): p is [Token, Token] => p !== null)
          })
        : [],
    [tokens, chainId],
  )

  // pairs saved by users
  const savedSerializedPairs = useUserStore((state) => state.pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}