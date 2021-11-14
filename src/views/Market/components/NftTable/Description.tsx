import React from 'react'
import styled from 'styled-components'

export interface DescriptionProps {
  description: string
  requirement?: string
}

const NftDescription = styled.span`
  color: ${({ theme }) => (theme.colors.text)};
  display: flex;
  align-items: center;
  padding-left: 20px;
`

const Description: React.FunctionComponent<DescriptionProps> = ({ description }) => {
  
  return (
    <NftDescription>
      {description}
    </NftDescription>
  )
}

export default Description
