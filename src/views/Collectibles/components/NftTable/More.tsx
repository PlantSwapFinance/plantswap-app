import React from 'react'
import styled from 'styled-components'
import { Tag, AuctionIcon, HarvestIcon } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetCollectibles } from 'state/hooks'
import { useProfile } from 'state/profile/hooks'
// To filter dev features
import { MASTERGARDENERDEVADDRESS } from 'config'
import { useAccount } from 'wagmi'
// 

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
  const { address: account } = useAccount()
  
  return (
    <Amount earned={0}>
        {tokenIds[identifier] && (
          <PaddedTag outline variant="secondary">
            {t('In Wallet')}
          </PaddedTag>
        )}
        {profile?.nft?.identifier === identifier && (
          <PaddedTag outline variant="success">
            {t('Profile Pic')}
          </PaddedTag>
        )}
        {/* Still in development:1 */}
        {account === MASTERGARDENERDEVADDRESS && profile && (
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
        {/* End of 1st dev filter */}
    </Amount>
  )
}

export default More
