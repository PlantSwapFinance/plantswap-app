import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@plantswap/uikit'
import { Farm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface GardenWithStakedValue extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const AccentGradient = keyframes`  
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

const StyledCardAccent = styled.div`
  background: ${({ theme }) => `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`};
  background-size: 400% 400%;
  animation: ${AccentGradient} 2s linear infinite;
  border-radius: 32px;
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -3px;
  left: -1px;
  z-index: -1;
`

const FCard = styled.div<{ isPromotedGarden: boolean }>`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme, isPromotedGarden }) => (isPromotedGarden ? '31px' : theme.radii.card)};
  box-shadow: 0px 1px 4px rgba(25, 19, 38, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface GardenCardProps {
  garden: GardenWithStakedValue
  displayApr: string
  removed: boolean
  plantPrice?: BigNumber
  account?: string
}

const GardenCard: React.FC<GardenCardProps> = ({ garden, displayApr, removed, plantPrice, account }) => {
  const { t } = useTranslation()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    garden.liquidity && garden.liquidity.gt(0)
      ? `$${garden.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = garden.lpSymbol && garden.lpSymbol.toUpperCase()
  const earnLabel = garden.dual ? garden.dual.earnLabel : t('PLANT + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: garden.quoteToken.address,
    tokenAddress: garden.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = getAddress(garden.lpAddresses)
  const isPromotedGarden = garden.token.symbol === 'PLANT'

  return (
    <FCard isPromotedGarden={isPromotedGarden}>
      {isPromotedGarden && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={garden.multiplier}
        isCommunityGarden={garden.isCommunity}
        token={garden.token}
        quoteToken={garden.rewardToken}
      />
      {!removed && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{t('APR')}:</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {garden.apr ? (
              <>
                <ApyButton
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  plantPrice={plantPrice}
                  apr={garden.apr}
                  displayApr={displayApr}
                />
                {displayApr}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <Text>{t('Earn')}:</Text>
        <Text bold>{earnLabel}</Text>
      </Flex>
      <CardActionsContainer garden={garden} account={account} addLiquidityUrl={addLiquidityUrl} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          bscScanAddress={getBscScanLink(lpAddress, 'address')}
          infoAddress={`https://pancakeswap.info/token/${lpAddress}`}
          totalValueFormatted={totalValueFormatted}
          lpLabel={lpLabel}
          addLiquidityUrl={addLiquidityUrl}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default GardenCard
