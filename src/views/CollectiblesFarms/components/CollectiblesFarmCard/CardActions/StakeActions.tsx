import React from 'react'
import { Flex, Button, IconButton, AddIcon, MinusIcon, useModal, Skeleton } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { CollectiblesFarm } from 'state/types'
import { Nft } from 'config/constants/types'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'

interface StakeActionsProps {
  collectiblesFarm: CollectiblesFarm
  nftsInWallet: Nft[]
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  collectiblesFarm,
  nftsInWallet,
  stakedBalance,
  isStaked,
  isLoading = false,
}) => {
  const { stakingTokenPrice, isFinished } = collectiblesFarm
  const { t } = useTranslation()

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol="Gardeners" />)

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

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
          {stakedBalance.toNumber()}
          </>
        </Flex>
        <Flex>
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="24px" />
          </IconButton>
            <IconButton
              variant="secondary"
              onClick={nftsInWallet.length > 0 ? onPresentStake : onPresentTokenRequired}
              disabled={isFinished}
            >
              <AddIcon color="primary" width="24px" height="24px" />
            </IconButton>
        </Flex>
      </Flex>
    ) : (
      <Button disabled={isFinished} onClick={nftsInWallet.length ? onPresentStake : onPresentTokenRequired}>
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
