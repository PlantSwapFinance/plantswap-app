import React from 'react'
import { Box, Button, Flex, Text } from '@plantswap/uikit'
import { useAllTransactions } from 'state/transactions/hooks'
import { clearAllTransactions } from 'state/transactions/store'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { orderBy } from 'lodash'
import TransactionRow from './TransactionRow'

const WalletTransactions: React.FC = () => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const allTransactions = useAllTransactions()
  const sortedTransactions = orderBy(allTransactions, 'addedTime', 'desc')

  const handleClearAll = () => {
    if (chainId) {
      clearAllTransactions({ chainId })
    }
  }

  return (
    <Box minHeight="120px">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold">
          {t('Recent Transactions')}
        </Text>
        {sortedTransactions.length > 0 && (
          <Button scale="sm" onClick={handleClearAll} variant="text" px="0">
            {t('Clear all')}
          </Button>
        )}
      </Flex>
      {sortedTransactions.length > 0 ? (
        sortedTransactions.map((txn) => <TransactionRow key={txn.hash} txn={txn} />)
      ) : (
        <Text textAlign="center">{t('No recent transactions')}</Text>
      )}
    </Box>
  )
}

export default WalletTransactions