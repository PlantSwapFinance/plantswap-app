import React, { CSSProperties, MutableRefObject, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@pancakeswap/sdk'
import { Text } from '@plantswap/uikit'
import styled from 'styled-components'
import { List, type ListImperativeAPI, type RowComponentProps } from 'react-window'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { LightGreyCard } from 'components/Card'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedActiveList } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useIsUserAddedToken, useAllInactiveTokens } from '../../hooks/Tokens'
import Column from '../Layout/Column'
import { RowFixed, RowBetween } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'
import CircleLoader from '../Loader/CircleLoader'
import { isTokenOnList } from '../../utils'
import ImportRow from './ImportRow'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 8px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.background};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size="24px" />
      <Column>
        <Text bold>{currency.symbol}</Text>
        <Text color="textSubtle" small ellipsis maxWidth="200px">
          {!isOnSelectedList && customAdded && 'Added by user •'} {currency.name}
        </Text>
      </Column>
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <CircleLoader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

type RowProps = {
  itemData: (Currency | undefined)[]
  selectedCurrency?: Currency | null
  otherCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  breakIndex: number | undefined
  showImportView: () => void
  setImportToken: (token: Token) => void
  chainId: number
  inactiveTokens: { [address: string]: Token }
  t: (key: string, options?: Record<string, unknown>) => string
}

function CurrencyListRow({ index, style, ...rowProps }: RowComponentProps<RowProps>) {
  const { itemData, selectedCurrency, otherCurrency, onCurrencySelect, breakIndex, showImportView, setImportToken, chainId, inactiveTokens, t } =
    rowProps
  const currency: Currency = itemData[index]
  const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
  const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
  const handleSelect = () => onCurrencySelect(currency)

  const token = wrappedCurrency(currency, chainId)

  const showImport = inactiveTokens && token && Object.keys(inactiveTokens).includes(token.address)

  if (index === breakIndex || !itemData) {
    return (
      <FixedContentRow style={style}>
        <LightGreyCard padding="8px 12px" borderRadius="8px">
          <RowBetween>
            <Text small>{t('Expanded results from inactive Token Lists')}</Text>
            <QuestionHelper
              text={t(
                "Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists.",
              )}
              ml="4px"
            />
          </RowBetween>
        </LightGreyCard>
      </FixedContentRow>
    )
  }

  if (showImport && token) {
    return <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
  }
  return (
    <CurrencyRow
      style={style}
      currency={currency}
      isSelected={isSelected}
      onSelect={handleSelect}
      otherSelected={otherSelected}
    />
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  breakIndex,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<ListImperativeAPI | undefined>
  showETH: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  breakIndex: number | undefined
}) {
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencies] : currencies
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, currencies, showETH])

  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const inactiveTokens: {
    [address: string]: Token
  } = useAllInactiveTokens()

  const rowKey = useMemo(() => (index: number, data: RowProps) => currencyKey(data.itemData[index]), [])

  return (
    <List
      listRef={fixedListRef}
      style={{ height, width: '100%' }}
      rowComponent={CurrencyListRow}
      rowCount={itemData.length}
      rowHeight={56}
      rowKey={rowKey}
      rowProps={{
        itemData,
        selectedCurrency,
        otherCurrency,
        onCurrencySelect,
        breakIndex,
        showImportView,
        setImportToken,
        chainId,
        inactiveTokens,
        t,
      }}
    />
  )
}