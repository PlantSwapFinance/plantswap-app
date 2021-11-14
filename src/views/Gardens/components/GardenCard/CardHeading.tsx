import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading } from '@plantswap/uikit'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import { TokenImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityGarden?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityGarden, token }) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <TokenImage token={token} width={64} height={64} />
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCommunityGarden ? <CommunityTag /> : <CoreTag />}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
