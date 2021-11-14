import React from 'react'
import styled from 'styled-components'
import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@plantswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Token } from 'config/constants/types'
import { TokenImage } from 'components/TokenImage'

export interface GardenProps {
  label: string
  pid: number
  token: Token
  rewardToken: Token
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

const Garden: React.FunctionComponent<GardenProps> = ({ token, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderGardening = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Gardening')}
        </Text>
      )
    }
    return null
  }

  return (
    <Container>
      <TokenWrapper>
        <TokenImage token={token} width={40} height={40} />
      </TokenWrapper>
      <div>
        {handleRenderGardening()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Garden
