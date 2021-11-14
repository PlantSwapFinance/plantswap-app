import React from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { 
  useMatchBreakpoints, 
  Button, 
  HarvestIcon,
  AuctionIcon, 
  MegaphoneIcon, 
  SchoolIcon, 
  SuperMarketIcon, 
  SyncAltIcon,
  BidIcon, 
  useModal, 
  Text 
} from '@plantswap/uikit'
// To filter dev features
import { MASTERGARDENERDEVADDRESS } from 'config'
import { useWeb3React } from '@web3-react/core'
// 
import { useTranslation } from 'contexts/Localization'
import TransferNftModal from '../TransferNftModal'
import ClaimNftModal from '../ClaimNftModal'

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
const Action: React.FunctionComponent<ActionProps> = ({ nft, canClaim = false, tokenIds = [], onClaim, refresh }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { variationId } = nft

  const handleSuccess = () => {
    refresh()
  }

  const [onPresentTransferModal] = useModal(<TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={handleSuccess} />)
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={handleSuccess} onClaim={onClaim} />)

  return (
   <DisplayAction>
      <ButtonTable>
        <ButtonRow>
          {canClaim ? (
            <PaddedButton>
              <Button width="100%" mt="24px" onClick={onPresentClaimModal} startIcon={<SchoolIcon />}>
                  {t('Claim this NFT')}
              </Button>
            </PaddedButton>
          ) : (tokenIds[nft.identifier] ? (
            <>
            {/* Still in development:1 */}
            {account === MASTERGARDENERDEVADDRESS && (
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
              {/* End of 1st dev filter */}
            </>
          ) : (<Text>{t(`You can't claim more of this token serie`)}</Text>)
          )}
        </ButtonRow>
        {isMobile ? (
          <>
            <ButtonRow>
              {/* Buy, bid place buy order */}
              <>
                {/* Still in development:2 */}
                {account === MASTERGARDENERDEVADDRESS && (
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
                  )}
                {/* End of 2nd dev filter */}
              </>
            </ButtonRow>
            <ButtonRow>
              {/* Still in development:3 */}
              {account === MASTERGARDENERDEVADDRESS && (
                <PaddedButton>
                  <a href={`/market/buyNft/${variationId}`} target="_blank" rel="noopener noreferrer">
                    <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<BidIcon />}>
                      {t('Place a buy offer')}
                    </Button>
                  </a>
                </PaddedButton>
              )}
              {/* End of 3rd dev filter */}
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
              {/* Still in development:4 */}
              {account === MASTERGARDENERDEVADDRESS && (
                <>
                  {/* Buy, bid place buy order */}
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
              )}
              {/* End of 4th dev filter */}
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
