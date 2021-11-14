import React from 'react'
import styled from 'styled-components'

export interface ImageProps {
  images: string
  alt: string
}

const NftImage = styled.span`
  color: ${({ theme }) => (theme.colors.text)};
  display: flex;
  align-items: center;
  padding-left: 20px;
`

const Image: React.FunctionComponent<ImageProps> = ({ images, alt }) => {

  const rootPath = `/images/nfts/${images}`
  
  return (
    <NftImage>
      <img src={rootPath} alt={alt} width={100} />
    </NftImage>
  )
}

export default Image
