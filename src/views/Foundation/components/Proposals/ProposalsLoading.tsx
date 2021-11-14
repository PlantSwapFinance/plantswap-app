import React from 'react'
import { Flex } from '@plantswap/uikit'
import styled from 'styled-components'
// import times from 'lodash/times'

const Row = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const Wrapper = styled.div`
  ${Row}:last-child {
    border-bottom: 0;
  }
`

const ProposalsLoading = () => {
  return (
    <Wrapper>
      <>
      </>
    </Wrapper>
  )
}

export default ProposalsLoading
