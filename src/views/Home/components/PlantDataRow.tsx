import React from 'react'
import styled from 'styled-components'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getPlantAddress } from 'utils/addressHelpers'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { usePricePlantBusd } from 'state/farms/hooks'
import { Flex, Text, Heading, Skeleton } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 8px;
  margin-top: 24px;
  grid-template-columns: repeat(3, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(5, auto);
  }
`

const emissionsPerBlock = 0.02

const PlantDataRow = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getPlantAddress()))
  const plantSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  const plantPriceBusd = usePricePlantBusd()
  const mcap = plantPriceBusd.times(plantSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  const ecologicalContributionString = formatLocalisedCompactNumber(10500)

  return (
    <Grid>
      <Flex flexDirection="column">
        <Text color="textSubtle">{t('Total supply')}</Text>
        {plantSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={plantSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </Flex>
      <StyledColumn>
        <Text color="textSubtle">{t('Burned to date')}</Text>
        {burnedBalance ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder>
        <Text color="textSubtle">{t('Total contribution')}</Text>
        {ecologicalContributionString ? (
          <Heading scale="lg">{t('$%ecologicalContribution%', { ecologicalContribution: ecologicalContributionString })}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder>
        <Text color="textSubtle">{t('Market cap')}</Text>
        {mcap?.gt(0) && mcapString ? (
          <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('Current emissions')}</Text>

        <Heading scale="lg">{t('%plantEmissions%/block', { plantEmissions: emissionsPerBlock })}</Heading>
      </StyledColumn>
    </Grid>
  )
}

export default PlantDataRow
