import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { VerticalGardenCategory } from 'config/constants/types'
import { Flex, CardFooter, ExpandableLabel } from '@plantswap/uikit'
import { CommunityTag, CoreTag, BinanceTag, PancakeswapTag, CafeswapTag, GoosefinanceTag } from 'components/Tags'
import { VerticalGarden } from 'state/types'
import ExpandedFooter from './ExpandedFooter'

const tags = {
  [VerticalGardenCategory.BINANCE]: BinanceTag,
  [VerticalGardenCategory.CORE]: CoreTag,
  [VerticalGardenCategory.COMMUNITY]: CommunityTag,
  [VerticalGardenCategory.CAFE]: CafeswapTag,
  [VerticalGardenCategory.PANCAKE]: PancakeswapTag,
  [VerticalGardenCategory.GOOSE]: GoosefinanceTag,
}

interface FooterProps {
  verticalGarden: VerticalGarden
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

const Footer: React.FC<FooterProps> = ({ verticalGarden, account }) => {
  const { verticalGardenCategory } = verticalGarden
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const Tag = tags[verticalGardenCategory]

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
      {isExpanded && <ExpandedFooter verticalGarden={verticalGarden} account={account} />}
    </CardFooter>
  )
}

export default Footer
