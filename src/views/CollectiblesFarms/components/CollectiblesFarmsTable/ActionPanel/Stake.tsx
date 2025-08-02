import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, Flex, Text } from '@plantswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useAccount } from 'wagmi'
import { CollectiblesFarm } from 'state/types'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useGetCollectibles } from 'state/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { ActionContainer, ActionTitles, ActionContent } from './styles'
import NotEnoughTokensModal from '../../CollectiblesFarmCard/Modals/NotEnoughTokensModal'
import StakeModal from '../../CollectiblesFarmCard/Modals/StakeModal'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps {
  collectiblesFarm: CollectiblesFarm
  userDataLoaded: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ collectiblesFarm, userDataLoaded }) => {
  const {
    isFinished,
    userData,
    stakingTokenPrice
  } = collectiblesFarm
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const stakedBalance = userData?.collectiblesBalance ? new BigNumber(userData.collectiblesBalance) : BIG_ZERO
  const isNotVaultAndHasStake = stakedBalance.gt(0)

  const { nftsInWallet } = useGetCollectibles()

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol="Nft" />)

  const [onPresentStake] = useModal(
    <StakeModal
      collectiblesFarm={collectiblesFarm}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      collectiblesFarm={collectiblesFarm}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const onStake = () => {
    onPresentStake()
  }

  const onUnstake = () => {
    onPresentUnstake()
  }

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {'Nft '}
          </Text>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Staked')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
            <Balance
              lineHeight="1"
              bold
              fontSize="20px"
              decimals={5}
              value={1}
            />
          </Flex>
          <IconButtonWrapper>
            <IconButton variant="secondary" onClick={onUnstake} mr="6px">
              <MinusIcon color="primary" width="14px" />
            </IconButton>

              <IconButton
                variant="secondary"
                onClick={nftsInWallet.length > 0 ? onStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <AddIcon color="primary" width="14px" />
              </IconButton>
          </IconButtonWrapper>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Stake')}{' '}
        </Text>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          Nft
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button
          width="100%"
          onClick={nftsInWallet.length > 0 ? onStake : onPresentTokenRequired}
          variant="secondary"
          disabled={isFinished}
        >
          {t('Stake')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
