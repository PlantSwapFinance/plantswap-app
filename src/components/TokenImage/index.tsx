import React from 'react'
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenTrippleImage as UIKitTokenTrippleImage,
  TokenTrippleImageProps as UIKitTokenTrippleImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from '@plantswap/uikit'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

interface TokenTrippleImageProps extends Omit<UIKitTokenTrippleImageProps, 'primarySrc' | 'secondarySrc' | 'thirdSrc'> {
  primaryToken: Token
  secondaryToken: Token
  thirdToken: Token
}

export const TokenTrippleImage: React.FC<TokenTrippleImageProps> = ({ primaryToken, secondaryToken, thirdToken, ...props }) => {
  return (
    <UIKitTokenTrippleImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      thirdSrc={getImageUrlFromToken(thirdToken)}
      {...props}
    />
  )
}
interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
  const address = getAddress(token.symbol === 'BNB' ? tokens.wbnb.address : token.address)
  return `/images/tokens/${address}.svg`
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken, ...props }) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}
