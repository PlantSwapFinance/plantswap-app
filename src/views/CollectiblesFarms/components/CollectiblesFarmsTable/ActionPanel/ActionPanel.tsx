import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  Box,
  Button,
  Flex,
  LinkExternal,
  MetamaskIcon,
  Text,
} from '@plantswap/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { CollectiblesFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Harvest from './Harvest'
import Stake from './Stake'
import Apr from '../Apr'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
}

interface ActionPanelProps {
  account: string
  collectiblesFarm: CollectiblesFarm
  userDataLoaded: boolean
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 230px;
  }
`

const ActionPanel: React.FC<ActionPanelProps> = ({ account, collectiblesFarm, userDataLoaded, expanded, breakpoints }) => {
  const {
    stakingRewardToken,
    collectiblesFarmingPoolContract
  } = collectiblesFarm
  const { t } = useTranslation()
  const collectiblesFarmsContractAddress = getAddress(collectiblesFarmingPoolContract)
  const { isXs, isSm, isMd } = breakpoints

  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const tokenAddress = stakingRewardToken.address ? getAddress(stakingRewardToken.address) : ''

  const maxStakeRow = null

  const aprRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text>{t('APR')}:</Text>
      <Apr collectiblesFarm={collectiblesFarm} showIcon />
    </Flex>
  )

  const totalStakedRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text maxWidth={['50px', '100%']}>{t('Total staked')}:</Text>
    </Flex>
  )

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <>
        {maxStakeRow}
        {(isXs || isSm) && aprRow}
        {(isXs || isSm || isMd) && totalStakedRow}
        <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          <LinkExternal href={`https://plantswap.info/token/${getAddress(stakingRewardToken.address)}`} bold={false}>
            {t('See Token Info')}
          </LinkExternal>
        </Flex>
        <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          <LinkExternal href={stakingRewardToken.projectLink} bold={false}>
            {t('View Project Site')}
          </LinkExternal>
        </Flex>
        {collectiblesFarmsContractAddress && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal
              href={`${BASE_BSC_SCAN_URL}/address/${collectiblesFarmsContractAddress}`}
              bold={false}
            >
              {t('View Contract')}
            </LinkExternal>
          </Flex>
        )}
        {account && isMetaMaskInScope && tokenAddress && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() => registerToken(tokenAddress, stakingRewardToken.symbol, stakingRewardToken.decimals)}
            >
              <Text color="primary">{t('Add %symbol% to Metamask', { symbol: stakingRewardToken.symbol })}</Text>
              <MetamaskIcon ml="4px" />
            </Button>
          </Flex>
        )}
        </>
      </InfoSection>
      <ActionContainer>
        <Harvest {...collectiblesFarm} userDataLoaded={userDataLoaded} />
        <Stake collectiblesFarm={collectiblesFarm} userDataLoaded={userDataLoaded} />
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
