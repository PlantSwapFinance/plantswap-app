import React from 'react'
import { Button, ChevronDownIcon, Text, useModal, Flex } from '@plantswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import NftSearchModal from '../SearchModal/NftSearchModal'

import { RowBetween } from '../Layout/Row'
import { Input as NumericalInput } from './NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0.5rem;
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`
interface NftInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onNftSelect: (currency: number) => void
  nft?: any | string | null
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
}

export default function NftInputPanel({
  value,
  onUserInput,
  label,
  onNftSelect,
  nft,
  disableCurrencySelect = false,
  hideInput = false,
  id,
}: NftInputPanelProps) {
  // const { account } = useActiveWeb3React()
  // const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const translatedLabel = label || t('Input')

  const [onPresentNftModal] = useModal(
    <NftSearchModal 
    onNftSelect={onNftSelect} />,
  )

  
  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{translatedLabel}</Text>
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
            </>
          )}
          <CurrencySelectButton
            selected={!!nft}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentNftModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
                <Text id="pair">
                  {t('Select a nft address')}
                </Text>
              
              
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
