import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token, Address } from 'config/constants/types'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  label: string
  description: string
  labelSvg: string
  stakingRewardToken: Token
  collectiblesFarmingPoolContract: Address
  isAutoVault?: boolean
  collectiblesFarmMasterGardenerAllocPt: number
  isFinished?: boolean
  isStaking?: boolean
}> = ({ label, description, labelSvg, stakingRewardToken, collectiblesFarmMasterGardenerAllocPt, isFinished = false, isStaking = false }) => {
  const { t } = useTranslation()
  const background = isStaking ? 'newTrees' : 'bubblegum'
  const subText = isStaking ? 'contrast' : 'textSubtle'

  const getHeadingPrefix = () => {
    return t('Earn')
  }

  const getSubHeading = () => {
    return t('Stake %symbol% collectibles', { symbol: label })
  }

  let earnTokenEcho = stakingRewardToken.symbol
  if(collectiblesFarmMasterGardenerAllocPt > 0) {
    earnTokenEcho = `🌱${stakingRewardToken.symbol}`
  }
  const srclabelSvg = `/images/nfts/${labelSvg}`

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earnTokenEcho}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : subText}>{getSubHeading()}</Text>
        </Flex>
          {labelSvg ? (
            <Image src={srclabelSvg} alt={label} width={72} height={72} />
          ) : (
            <>
              {/* + Add NftToken from UIKit */}
              <Image src="/images/nfts/0xA7C25c199BC8Dd06c4Edd2Ea8aEbCeC40A404c03.svg" alt={label} width={72} height={72} />
            </>
          )}
      </Flex>
      <Text fontSize="10px" color="textSubtle">{description}</Text>
    </Wrapper>
  )
}

export default StyledCardHeader
