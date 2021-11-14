import React, { useState } from 'react'
import {
  Card, 
  CardBody, 
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBackButton,
  ModalCloseButton,
  InjectedModalProps, 
  ModalBody,
  Heading,
  Flex, 
  Text, 
  Button
} from '@plantswap/uikit'
import { useGetCollectibles } from 'state/hooks'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NftModalView } from './types'
import NftSelectionCard from './NftSelectionCard'

const Footer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

interface CurrencySearchModalProps extends InjectedModalProps {
  onNftSelect: (nft: number) => void
}
// eslint-disable-next-line
export default function NftSearchModal({ onDismiss = () => null, onNftSelect }:CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<NftModalView>(NftModalView.search)

  const [selectedNft, setSelectedNft] = useState<number>(0)
  const { t } = useTranslation()
  const { nftsInWallet, tokenIds } = useGetCollectibles()

  const config = {
    [NftModalView.search]: { title: t('Select a Nft contract'), onBack: undefined },
    [NftModalView.manage]: { title: t('Manage Nfts'), onBack: () => setModalView(NftModalView.search) },
  }
 
  const handleCurrencySelect = null
/*  const handleCurrencySelect = useCallback(
    (value: number) => {
      onDismiss()
      onNftSelect(value)
    },
    [onDismiss, onNftSelect],
  ) */

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          {config[modalView].onBack && <ModalBackButton onBack={config[modalView].onBack} />}
          <Heading>{config[modalView].title}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        {nftsInWallet.length > 0 && (
          <Card mb="24px">
            <CardBody>
              {nftsInWallet.length > 0 && (
                nftsInWallet.map((walletNft) => {
                  const [firstTokenId] = tokenIds[walletNft.identifier]

                  return (
                    <NftSelectionCard
                      name="profilePicture"
                      key={walletNft.identifier}
                      value={firstTokenId}
                      image={`/images/nfts/${walletNft.images.md}`}
                      isChecked={firstTokenId === selectedNft}
                      onChange={(value) => setSelectedNft(parseInt(value, 10))}>
                      <Text bold>{walletNft.name}</Text>
                    </NftSelectionCard>
                  )
                })
              )}
            </CardBody>
          </Card>
        )}
        {nftsInWallet.length === 0 && (
          <Flex justifyContent="center" p="32px">
            <Text fontSize="20px" bold color="textDisabled">
              {t('No NFTs Found')}
            </Text>
          </Flex>
        )}
      </StyledModalBody>
      <Footer>
        <Button
          onClick={handleCurrencySelect}
          id="selectWalletNft"
        >
          {t('Select Nft')}
        </Button>
      </Footer>
    </StyledModalContainer>
  )
}
