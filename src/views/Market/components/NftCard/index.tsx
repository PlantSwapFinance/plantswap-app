import React, { useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  HarvestIcon,
  AuctionIcon, 
  MegaphoneIcon, 
  SuperMarketIcon, 
  SyncAltIcon,
  BidIcon, 
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  Farmer2Icon, 
  PlantRoundIcon, 
  CardFooter,
  WalletIcon, 
  useModal,
} from '@plantswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from 'contexts/Localization'
import { Nft } from 'config/constants/types'
import InfoRow from '../InfoRow'
import TransferNftModal from '../TransferNftModal'
import Preview from './Preview'

export interface NftCardProps {
  nft: Nft
  canClaim?: boolean
  tokenIds?: number[]
  onClaim?: () => Promise<ethers.providers.TransactionResponse>
  refresh: () => void
}

const Header = styled(InfoRow)`
  min-height: 28px;
`

const DetailsButton = styled(Button).attrs({ variant: 'text' })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const TagRight = styled(Tag)`
  align-items: right;
`


const InfoBlock = styled.div`
  padding: 24px;
`
// eslint-disable-next-line
const NftCard: React.FC<NftCardProps> = ({ nft, canClaim = false, tokenIds = [], onClaim, refresh }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const { profile } = useProfile()
  const { identifier, variationId, name, description, requirement } = nft
  const walletOwnsNft = tokenIds.length > 0
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  const handleClick = async () => {
    setIsOpen(!isOpen)
  }

  const handleSuccess = () => {
    refresh()
  }

  const [onPresentTransferModal] = useModal(<TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={handleSuccess} />)

  return (
    <Card isActive={walletOwnsNft}>
      <Preview nft={nft} isOwned={walletOwnsNft} />
      <br />
      <Tag outline variant="success" endIcon={<PlantRoundIcon width={18} />}>
        {(variationId % 2) ? (t('Best bid 5')) : (t('Buy for 4'))}&nbsp;
      </Tag>
      {(variationId % 2) ? (
        <Tag outline variant="warning" startIcon={<AuctionIcon width={18} />}>
          {t('End in 8h 15m')}
        </Tag>
      ) : (null)}
      <CardBody>
        <Header>
          <Heading>{name}</Heading>
      
          {walletOwnsNft && (
            <TagRight outline variant="secondary" startIcon={<WalletIcon width={18} />} />
          )}
          {profile?.nft?.identifier === identifier && (
            <TagRight outline variant="success" startIcon={<Farmer2Icon width={18} />} />
          )}
        </Header>
      </CardBody>
      <CardFooter p="0">
        <DetailsButton width="100%" endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
          {t('Details')}
        </DetailsButton>
        {isOpen && (
          <InfoBlock>
            <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
              {t(description)}
            </Text>
            {requirement && (
              <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
                <br />
                {t(requirement)}
              </Text>
            )}
            {walletOwnsNft && (
              <>
                {/* Place for sell */}
                <a href={`/market/sellNft/${variationId}`} target="_blank" rel="noopener noreferrer">
                  <Button width="100%" variant="secondary" mt="24px" startIcon={<SuperMarketIcon />}>
                    {t('Place for sale')}
                  </Button>
                </a>
                <br />
                {/* Place for buy */}
                <a href={`/market/createAuction/${variationId}`} target="_blank" rel="noopener noreferrer">
                  <Button width="100%" variant="secondary" mt="24px" startIcon={<MegaphoneIcon />}>
                    {t('Place for auction')}
                  </Button>
                </a>
              </>
            )}
            {/* Buy, bid place buy order */}
            <>
              {/* variant="" */}
              <a href={`/market/makeOffer/${variationId}`} target="_blank" rel="noopener noreferrer">
                <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<HarvestIcon />}>
                  {t('Buy from %countSellOffer% sell offer', { countSellOffer: 7 })}
                </Button>
              </a>
              {/* variant="success" */}
              <a href={`/market/makeOffer/${variationId}`} target="_blank" rel="noopener noreferrer">
                <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<AuctionIcon />}>
                  {t('Bid on %countAuction% auction', { countAuction: 8 })}
                </Button>
              </a>
              <a href={`/market/buyNft/${variationId}`} target="_blank" rel="noopener noreferrer">
                <Button width="100%" variant="tertiary" mt="24px" onClick={null} startIcon={<BidIcon />}>
                  {t('Place a buy offer')}
                </Button>
              </a>
            </>
            {walletOwnsNft && (
              <Button width="100%" variant="tertiary" mt="24px" onClick={onPresentTransferModal} startIcon={<SyncAltIcon />}>
                {t('Transfer')}
              </Button>
            )}
          </InfoBlock>
        )}
      </CardFooter>
    </Card>
  )
}

export default NftCard
