import React from 'react'
import { Box, Flex, LinkExternal, Message, Text } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useHasLowBnbBalance } from 'contexts/BnbBalanceContext'

export const BUY_BNB_URL = 'https://www.binance.com/en/how-to-buy/bnb'
export const BRIDGE_BNB_URL = 'https://www.bnbchain.org/en/bnb-chain-bridge'

interface LowBnbBalanceNoticeProps {
  /** One short line for narrow spots such as farm and pool cards. */
  compact?: boolean
  mt?: string
  mb?: string
}

/**
 * Explains network fees before a user without BNB reaches a wallet prompt that cannot succeed.
 * Renders nothing unless a wallet is connected and its BNB balance is known to be low.
 */
const LowBnbBalanceNotice: React.FC<LowBnbBalanceNoticeProps> = ({ compact = false, mt, mb }) => {
  const { t } = useTranslation()
  const hasLowBnbBalance = useHasLowBnbBalance()

  if (!hasLowBnbBalance) {
    return null
  }

  if (compact) {
    return (
      <Flex role="status" flexWrap="wrap" alignItems="center" mt={mt} mb={mb} style={{ gap: '0 6px' }}>
        <Text fontSize="12px" color="warning">
          {t('You need a little BNB for network fees.')}
        </Text>
        <LinkExternal href={BUY_BNB_URL} fontSize="12px">
          {t('Get BNB')}
        </LinkExternal>
      </Flex>
    )
  }

  return (
    <Message variant="warning" mt={mt} mb={mb}>
      <Box role="status">
        <Text bold>{t('You need a little BNB for network fees')}</Text>
        <Text as="p" fontSize="14px">
          {t(
            'Every approve, stake or swap on BNB Smart Chain costs a small fee paid in BNB, usually a few cents. Add some BNB to this wallet before you continue.',
          )}
        </Text>
        <Flex flexWrap="wrap" mt="4px" style={{ gap: '4px 16px' }}>
          <LinkExternal href={BUY_BNB_URL} fontSize="14px">
            {t('Buy BNB')}
          </LinkExternal>
          <LinkExternal href={BRIDGE_BNB_URL} fontSize="14px">
            {t('Bridge BNB from another chain')}
          </LinkExternal>
        </Flex>
      </Box>
    </Message>
  )
}

export default LowBnbBalanceNotice
