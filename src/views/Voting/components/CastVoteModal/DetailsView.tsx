import React from 'react'
import { Text, Flex } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { VotingBox, ModalInner } from './styles'

interface DetailsViewProps {
  total: BigNumber
  plantBalance: BigNumber
  plantVaultBalance: BigNumber
  plantPoolBalance: BigNumber
  poolsBalance: BigNumber
  plantBnbLpBalance: BigNumber
}

const DetailsView: React.FC<DetailsViewProps> = ({
  total,
  plantBalance,
  plantVaultBalance,
  plantPoolBalance,
  poolsBalance,
  plantBnbLpBalance,
}) => {
  const { t } = useTranslation()

  return (
    <ModalInner mb="0">
      <Text as="p" mb="24px" fontSize="14px" color="textSubtle">
        {t(
          'Your voting power is determined by the amount of PLANT you held at the block detailed below. PLANT held in other places does not contribute to your voting power.',
        )}
      </Text>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Overview')}
      </Text>
      <VotingBox>
        <Text color="secondary">{t('Your Voting Power')}</Text>
        <Text bold fontSize="20px">
          {total.toFormat(3)}
        </Text>
      </VotingBox>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Your Plant Held Now')}
      </Text>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Wallet')}
        </Text>
        <Text textAlign="right">{plantBalance.toFormat(3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Manual PLANT Pool')}
        </Text>
        <Text textAlign="right">{plantPoolBalance.toFormat(3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Auto PLANT Pool')}
        </Text>
        <Text textAlign="right">{plantVaultBalance.toFormat(3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Other Syrup Pools')}
        </Text>
        <Text textAlign="right">{poolsBalance.toFormat(3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('PLANT BNB LP')}
        </Text>
        <Text textAlign="right">{plantBnbLpBalance.toFormat(3)}</Text>
      </Flex>
    </ModalInner>
  )
}

export default DetailsView
