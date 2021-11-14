import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { 
  Button, 
  Text, 
  ButtonMenu, 
  ButtonMenuItem, 
  PencilConfigIcon, 
} from '@plantswap/uikit'
import { CurrencyAmount } from '@pancakeswap/sdk'
import { Nft } from 'config/constants/types'
import nfts from 'config/constants/nfts'
import { useTranslation } from 'contexts/Localization'
import { Field } from 'state/swap/actions'
import { FieldNft } from 'state/market/actions'
import { DatePicker, TimePicker } from 'components/DatePicker'
import { AutoRow } from 'components/Layout/Row'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import NftInputPanel from 'components/NftInputPanel'
import { AppHeader, AppBody } from 'components/App'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from 'state/swap/hooks'
import { useNftSwapActionHandlers } from 'state/market/hooks'

export enum WalletView {
  TOKEN,
  NFT,
}

interface FormMarketSellNftModalProps {
  nft?: Nft
  tokenIds?: number[]
  initialView?: WalletView
}

const Value = styled(Text)`
  font-weight: 600;
`

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-bottom: 0;
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.gradients.bubblegum};

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    min-height: calc(100vh - 64px);
  }
`

const InfoRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

const Page: React.FC<FormMarketSellNftModalProps> = ({ initialView = WalletView.TOKEN }) => {
  const { id }: { id: string } = useParams()
  const [view, setView] = useState(initialView)
  // eslint-disable-next-line
  const [error, setError] = useState(null)
  const { t } = useTranslation()
  
  let selectedVariationName;
  if(id) {
    selectedVariationName = nfts.filter(nftRow => nftRow.variationId === parseInt(id, 10)).map((nftRow) => {
      return nftRow.name
    })
  }
  
  // check whether the user has approved the router on the input token
  const [approval] = useState<boolean>(false)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === true) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const showWrap = true
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const { onNftSelection, onUserNftInput } = useNftSwapActionHandlers()

  const handleTypeInput = useCallback(
    (value2: string) => {
      onUserInput(Field.INPUT, value2)
    },
    [onUserInput],
  )

  const handleTypeNftInput = useCallback(
    (value2: string) => {
      onUserNftInput(FieldNft.INPUT, value2)
    },
    [onUserNftInput],
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency) 
    },
    [onCurrencySelection],
  )

  const handleInputNftSelect = useCallback(
    (inputNft) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onNftSelection(FieldNft.INPUT, inputNft) 
    },
    [onNftSelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const plantCost = 0.25

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  return (
    <StyledPage>
      <AppBody>
      <AppHeader title={t('Auction your Collectibles')} subtitle={t('Trade tokens and collectibles')} />
      <Wrapper id="swap-page">
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}

        {selectedVariationName && (
          <InfoRow>
            <Text>{t('Create auction for')}:</Text>
            <Value>{t('1x %nftName% NFT', { nftName: selectedVariationName })}</Value>
          </InfoRow>
        )}

        <InfoRow>
          <Text>&nbsp;</Text>
        </InfoRow>

        <InfoRow>
          <Text>{t('Select a end to the auction')}:</Text>
        </InfoRow>

        <InfoRow>
          <Text>{t('End Date')}</Text>
          <DatePicker
            name="endDate"
            selected={null}
            onChange={null}
            placeholderText="YYYY/MM/DD"
          />
          {/* formErrors.startDate && fieldsState.startDate && <FormErrors errors={formErrors.startDate} /> */}
        </InfoRow>

        <InfoRow>
          <Text>{t('End Time')}</Text>
          <TimePicker
            name="endTime"
            selected={null}
            onChange={null}
            placeholderText="00:00"
          />
          {/* formErrors.startTime && fieldsState.startTime && <FormErrors errors={formErrors.startTime} /> */}
        </InfoRow>

        <InfoRow>
          <Text>{t('Exchange for')}</Text>
        </InfoRow>

        <ButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
          <ButtonMenuItem>{t('Token')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Nft')}</ButtonMenuItem>
        </ButtonMenu>

        <InfoRow>
          <Text>&nbsp;</Text>
        </InfoRow>

        <InfoRow>
          <Text>{t('Minimum price')}:</Text>
        </InfoRow>

        <div>
          {view === WalletView.NFT && (
            <NftInputPanel
              label={t('Token Id')}
              value={[FieldNft.INPUT].toString()}
              nft={[FieldNft.INPUT].toString()}
              onUserInput={handleTypeNftInput}
              onNftSelect={handleInputNftSelect}
              id="swap-nft-output"
            />
          )}
            {view === WalletView.TOKEN && (
            <CurrencyInputPanel
              label={t('Minimum price')}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={false}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-output"
            />
          )}
        </div>

        <InfoRow>
          <Text>&nbsp;</Text>
        </InfoRow>
        
        <InfoRow>
          <Text>{t('Market fee')}:</Text>
          <Value>{t('%cost% PLANT', { cost: plantCost })}</Value>
        </InfoRow>
        <Text color="warning"><PencilConfigIcon />{t('The market is currently getting build, please be patient!')}</Text>

        
        <AutoRow>
          <Button
            mt="12px"
            id="confirm-swap-or-send"
            width="100%">
            {t('Place for auction')}
          </Button>
        </AutoRow>

        </Wrapper>
      </AppBody>
    </StyledPage>
  )
}

export default Page
