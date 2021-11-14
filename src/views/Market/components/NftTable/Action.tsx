import React from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { 
  useMatchBreakpoints, 
  Button, 
  HarvestIcon,
  AuctionIcon, 
  MegaphoneIcon, 
  SuperMarketIcon, 
  SyncAltIcon,
  BidIcon, 
  useModal
} from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import TransferNftModal from '../TransferNftModal'

export interface ActionProps {
  nft: any
  canClaim?: boolean
  tokenIds?: number[]
  onClaim?: () => Promise<ethers.providers.TransactionResponse>
  refresh: () => void
}

const DisplayAction = styled.span`
  color: ${({ theme }) => (theme.colors.text)};
  padding-left: 16px;
  display: flex;
  align-items: center;
`

const PaddedButton = styled.span`
  padding-left: 16px;
`
const ButtonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`

const ButtonRow = styled.tr`
  padding-top: 24px;
  display: flex;
  width: 100%;
`
// eslint-disable-next-line
const Action: React.FunctionComponent<ActionProps> = ({ nft, canClaim = false, tokenIds = [], onClaim, refresh }) => {
  const { t } = useTranslation()

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { variationId } = nft

  const handleSuccess = () => {
    refresh()
  }

  const [onPresentTransferModal] = useModal(<TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={handleSuccess} />)

  return (
   <DisplayAction>
      <ButtonTable>
        <ButtonRow>
          {tokenIds[nft.identifier] && (
            <>
              {/* Place for sell */}
              <PaddedButton>
                <a href={`/market/sellNft/${variationId}`} target="_blank" rel="noopener noreferrer">
                  <Button width="100%" variant="secondary" mt="24px" startIcon={<SuperMarketIcon />}>
                    {t('Place for sale')}
                  </Button>
                </a>
              </PaddedButton>
              {/* Place for buy */}
              <PaddedButton>
                <a href={`/market/createAuction/${variationId}`} target="_blank" rel="noopener noreferrer">
                  <Button width="100%" variant="secondary" mt="24px" startIcon={<MegaphoneIcon />}>
                    {t('Place for auction')}
                  </Button>
                </a>
              </PaddedButton>
            </>
          )}
        </ButtonRow>
        {isMobile ? (
          <>
            <ButtonRow>
              {/* Buy, bid place buy order */}
              <>
                <PaddedButton>
                {/* variant="" */}
                  <a href={`/market/makeOffer/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<HarvestIcon />}>
                      {t('Buy from %countSellOffer% sell offer', { countSellOffer: 7 })}
                    </Button>
                  </a>
                </PaddedButton>
                <PaddedButton>
                {/* variant="success" */}
                  <a href={`/market/makeOffer/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<AuctionIcon />}>
                      {t('Bid on %countAuction% auction', { countAuction: 8 })}
                    </Button>
                  </a>
                </PaddedButton>
              </>
            </ButtonRow>
            <ButtonRow>
              <>
                <PaddedButton>
                  <a href={`/market/buyNft/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<BidIcon />}>
                      {t('Place a buy offer')}
                    </Button>
                  </a>
                </PaddedButton>
              </>
              {tokenIds[nft.identifier] && (
                <PaddedButton>
                {/* variant="secondary" */}
                  <Button width="100%" variant="secondary" mt="24px" onClick={onPresentTransferModal} startIcon={<SyncAltIcon />}>
                    {t('Transfer')}
                  </Button>
                </PaddedButton>
              )}
            </ButtonRow>
          </>
        ) : (
          <>
            <ButtonRow>
              {/* Buy, bid place buy order */}
              <>
                <PaddedButton>
                {/* variant="" */}
                  <a href={`/market/makeOffer/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<HarvestIcon />}>
                      {t('Buy from %countSellOffer% sell offer', { countSellOffer: 7 })}
                    </Button>
                  </a>
                </PaddedButton>
                <PaddedButton>
                {/* variant="success" */}
                  <a href={`/market/makeOffer/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<AuctionIcon />}>
                      {t('Bid on %countAuction% auction', { countAuction: 8 })}
                    </Button>
                  </a>
                </PaddedButton>
                <PaddedButton>
                  <a href={`/market/buyNft/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<BidIcon />}>
                      {t('Place a buy offer')}
                    </Button>
                  </a>
                </PaddedButton>
              </>
              {tokenIds[nft.identifier] && (
                <PaddedButton>
                  <Button width="100%" variant="secondary" mt="24px" onClick={onPresentTransferModal} startIcon={<SyncAltIcon />}>
                    {t('Transfer')}
                  </Button>
                </PaddedButton>
              )}
            </ButtonRow>
          </>
        )}
      </ButtonTable>
    </DisplayAction>
  )
}

export default Action
