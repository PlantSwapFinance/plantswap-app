import React from 'react'
import styled from 'styled-components'
import { Tag, AuctionIcon, HarvestIcon, WalletIcon, Farmer2Icon } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetCollectibles } from 'state/hooks'
import { useProfile } from 'state/profile/hooks'

export interface MoreProps {
  identifier: string
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const PaddedTag = styled(Tag)`
  padding-left: 1em;
`

const More: React.FunctionComponent<MoreProps> = ({ identifier }) => {
  const { t } = useTranslation()
  const { tokenIds } = useGetCollectibles()
  const { profile } = useProfile()
  
  return (
    <Amount earned={0}>
      <Tag outline variant="warning" startIcon={<AuctionIcon />}>
        {t('End in 8h 15m')}
      </Tag>
      {tokenIds[identifier] && (
        <Tag outline variant="secondary" startIcon={<WalletIcon />} />
      )}
      {profile?.nft?.identifier === identifier && (
        <Tag outline variant="success" startIcon={<Farmer2Icon />} />
      )}
        {profile && (
          <>
            <PaddedTag outline variant="success" startIcon={<AuctionIcon />}>
              {t('Auction in progress')}
            </PaddedTag>
            <br />&nbsp;
            <PaddedTag outline variant="success" startIcon={<HarvestIcon />}>
              {t('Available to buy')}
            </PaddedTag>
          </>
        )}
    </Amount>
  )
}

export default More
