import React from 'react'
import styled from 'styled-components'
import { NftType } from 'config/constants/types'
// import { useFarmUser } from 'state/farms/hooks'
// import { useTranslation } from 'contexts/Localization'
import { Text } from '@plantswap/uikit'

export interface NameProps {
  name: string
  sortOrder: number
  identifier: string
  variationId: string | number
  type: NftType
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const Name: React.FunctionComponent<NameProps> = ({ name }) => {
  // const { t } = useTranslation()

  /*
  const handleRenderGardening = (): JSX.Element => {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('In Wallet')}
        </Text>
      )
    } 
    
    
        {handleRenderGardening()}
        */

  return (
    <Container>
      <div>
        <Text bold>{name}</Text>
      </div>
      
    </Container>
  )
}

export default Name
