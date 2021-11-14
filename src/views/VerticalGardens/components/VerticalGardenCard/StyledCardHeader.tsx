import React from 'react'
import { CardHeader, Heading, Text, Flex } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage, TokenTrippleImage } from 'components/TokenImage'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  stakingRewardToken: Token
  verticalEarningToken: Token
  stakingToken: Token
  isAutoVault?: boolean
  verticalGardenMasterGardenerAllocPt: number
  isFinished?: boolean
  isStaking?: boolean
}> = ({ stakingRewardToken, verticalEarningToken, stakingToken, verticalGardenMasterGardenerAllocPt, isFinished = false, isStaking = false }) => {
  const { t } = useTranslation()
  const background = isStaking ? 'newTrees' : 'bubblegum'
  const subText = isStaking ? 'contrast' : 'textSubtle'

  const getHeadingPrefix = () => {
    return t('Earn')
  }

  const getSubHeading = () => {
    return t('Stake %symbol%', { symbol: stakingToken.symbol })
  }

  let earnTokenEcho = stakingRewardToken.symbol
  if(verticalGardenMasterGardenerAllocPt > 0) {
    earnTokenEcho = `🌱${verticalEarningToken.symbol} + ${stakingRewardToken.symbol}`
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earnTokenEcho}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : subText}>{getSubHeading()}</Text>
        </Flex>
          {verticalGardenMasterGardenerAllocPt > 0 ? (
            <TokenTrippleImage primaryToken={stakingToken} secondaryToken={stakingRewardToken} thirdToken={verticalEarningToken} width={64} height={64} />
          ) : (
            <TokenPairImage primaryToken={stakingToken} secondaryToken={stakingRewardToken} width={64} height={64} />
          )}
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
