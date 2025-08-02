import React from 'react'
import styled from 'styled-components'
import { Text } from '@plantswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useGetCollectibles } from 'state/hooks'
import { fetchWalletNfts } from 'state/collectibles'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ImageProps } from './Image'
import { NameProps } from './Name'
import { DescriptionProps } from './Description'
import { MoreProps } from './More'
import Action from './Action'
import MasterGardeningSchoolAction from './MasterGardeningSchoolAction'

export interface ExtraProps {
  image: ImageProps
  name: NameProps
  description: DescriptionProps
  more: MoreProps
  expanded: boolean
}

const nftComponents = {
  'Relax PLANT Farmer': MasterGardeningSchoolAction,
  'Relax PLANT BNB Gardener': MasterGardeningSchoolAction,
  'Relax PLANT BUSD Farmer': MasterGardeningSchoolAction,
  'Relax PLANT USDC Farmer': MasterGardeningSchoolAction,
  'Relax PLANT CAKE Gardener': MasterGardeningSchoolAction,
}

const DisplayDetails = styled.span`
  color: ${({ theme }) => (theme.colors.text)};
  padding-left: 16px;
  display: flex;
  align-items: center;
  display: flex;
`

const ExtraTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`

const RequirementTitleCell = styled.tr`
  padding-top: 24px;
  display: flex;
  width: 100%;
`

const RequirementCell = styled.tr`
  padding-top: 24px;
  display: flex;
  width: 100%;
`

const ActionCell = styled.tr`
  padding-top: 24px;
  display: flex;
  width: 100%;
`

const Extra: React.FunctionComponent<ExtraProps> = (props) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { tokenIds } = useGetCollectibles()
  const { name, description } = props
  const nft = name
  const ActionBox = nftComponents[name.identifier] || Action

  const handleRefresh = () => {
    dispatch(fetchWalletNfts(account))
  }

  return (
    <DisplayDetails>
      <ExtraTable>
        <tr>
          {description.requirement ? ( 
            <>
            <RequirementTitleCell>
              <Text>{t('Requirement')}</Text>
            </RequirementTitleCell>
            <RequirementCell>
              <Text>{description.requirement}</Text>
            </RequirementCell>
            </>
          ) : null}
        </tr>
        <tr>
          <ActionCell>
          {account ? (
            <ActionBox nft={nft} tokenIds={tokenIds} refresh={handleRefresh} />
          ) : (
            <ConnectWalletButton width="100%" />
          )}
          </ActionCell>
        </tr>
      </ExtraTable>
    </DisplayDetails>
  )
}

export default Extra
