import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Skeleton } from '@plantswap/uikit'
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
    grid-template-columns: repeat(4, auto);
  }
`

const PlantDataRow = () => {
  const { t } = useTranslation()
  const totalDonation = 10500
  const pendingDonation = 250
  const foundationValidated = 1
  const totalProposals = 1

  return (
    <Grid>
      <Flex flexDirection="column">
        <Text color="textSubtle">{t('Total donation')}</Text>
        {totalDonation ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={totalDonation} unit=" USDC" />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </Flex>
      <StyledColumn>
        <Text color="textSubtle">{t('Pending donation')}</Text>
        {foundationValidated ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={pendingDonation} unit=" USDC" />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('Number of Foundation validated')}</Text>
        {foundationValidated ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={foundationValidated} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('total Foundation proposed')}</Text>
        {totalProposals ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={totalProposals} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
    </Grid>
  )
}

export default PlantDataRow
