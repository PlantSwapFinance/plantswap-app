import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { CollectiblesFarmCategory } from 'config/constants/types'
import { Flex, CardFooter, ExpandableLabel } from '@plantswap/uikit'
import { CommunityTag, CoreTag, BinanceTag, PancakeswapTag, CafeswapTag, GoosefinanceTag } from 'components/Tags'
import { CollectiblesFarm } from 'state/types'
import ExpandedFooter from './ExpandedFooter'

const tags = {
  [CollectiblesFarmCategory.BINANCE]: BinanceTag,
  [CollectiblesFarmCategory.CORE]: CoreTag,
  [CollectiblesFarmCategory.COMMUNITY]: CommunityTag,
  [CollectiblesFarmCategory.CAFE]: CafeswapTag,
  [CollectiblesFarmCategory.PANCAKE]: PancakeswapTag,
  [CollectiblesFarmCategory.GOOSE]: GoosefinanceTag,
}

interface FooterProps {
  collectiblesFarm: CollectiblesFarm
  account: string
  totalPlantInVault?: BigNumber
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const Footer: React.FC<FooterProps> = ({ collectiblesFarm, account }) => {
  const { collectiblesFarmCategory } = collectiblesFarm
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const Tag = tags[collectiblesFarmCategory]

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          <Tag />
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter collectiblesFarm={collectiblesFarm} account={account} />}
    </CardFooter>
  )
}

export default Footer
