import React from 'react'
import { BlockIcon, CheckmarkCircleIcon, Flex, Link, OpenNewIcon, RefreshIcon } from '@plantswap/uikit'
import styled from 'styled-components'
import { TransactionDetails } from 'state/transactions/store'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { getBscScanLink } from 'utils'

interface TransactionRowProps {
  txn: TransactionDetails
}

const TxnIcon = styled(Flex)`
  align-items: center;
  flex: none;
  width: 24px;
`

const Summary = styled.div`
  flex: 1;
  padding: 0 8px;
`

const TxnLink = styled(Link)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  margin-bottom: 16px;
  width: 100%;

  &:hover {
    text-decoration: none;
  }
`

const renderIcon = (txn: TransactionDetails, t: ContextApi['t']) => {
  if (!txn.receipt) {
    return <RefreshIcon spin width="24px" role="img" aria-label={t('Transaction pending')} />
  }

  return txn.receipt?.status === 1 || typeof txn.receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="24px" role="img" aria-label={t('Transaction confirmed')} />
  ) : (
    <BlockIcon color="failure" width="24px" role="img" aria-label={t('Transaction failed')} />
  )
}

const TransactionRow: React.FC<TransactionRowProps> = ({ txn }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  if (!txn) {
    return null
  }

  return (
    <TxnLink href={getBscScanLink(txn.hash, 'transaction', chainId)} external>
      <TxnIcon>{renderIcon(txn, t)}</TxnIcon>
      <Summary>{txn.summary ?? txn.hash}</Summary>
      <TxnIcon>
        <OpenNewIcon width="24px" color="primary" aria-hidden="true" />
      </TxnIcon>
    </TxnLink>
  )
}

export default TransactionRow
