import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  LinkExternal,
  Skeleton,
  useTooltip,
  Button,
  HelpIcon,
} from '@plantswap/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { VerticalGarden } from 'state/types'
import { useBlock } from 'state/block/hooks'
import useUpdateVerticalGarden from 'views/VerticalGardens/hooks/useUpdateVerticalGarden'
import { getAddress, } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'
import UpdateButton from './UpdateButton'

interface ExpandedFooterProps {
  verticalGarden: VerticalGarden
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ verticalGarden, account }) => {
  const { t } = useTranslation()

  const {
    vgId,
    stakingToken,
    stakingRewardToken, 
    verticalEarningToken, 
    totalStaked,
    verticalGardenContractAddress,
    lastRewardUpdateBlock,
    totalPendingStakedRewardToSplit,
    totalPendingPlantRewardToSplit,
    pendingStakedInStakedMasterChef,
    pendingPlantInPlantMasterGardener,
    userData,
  } = verticalGarden

  const tokenAddress = stakingRewardToken.address ? getAddress(stakingRewardToken.address) : ''
  const poolContractAddress = getAddress(verticalGardenContractAddress)
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask

  const { currentBlock } = useBlock()
  const lastRewardUpdateBlockToNumber = new BigNumber(lastRewardUpdateBlock).toNumber()
  const lastUpdate = currentBlock - lastRewardUpdateBlockToNumber

  const compoundedReward = userData?.compoundedReward ? new BigNumber(userData.compoundedReward).div(1000000000000000000) : BIG_ZERO
  const harvestedPlant = userData?.harvestedPlant ? new BigNumber(userData.harvestedPlant).div(1000000000000000000) : BIG_ZERO
  const harvestedReward = userData?.harvestedReward ? new BigNumber(userData.harvestedReward).div(1000000000000000000) : BIG_ZERO

  const totalPendingStakedRewardToSplitNum = 
    getBalanceNumber(totalPendingStakedRewardToSplit, 18) + 
    getBalanceNumber(pendingStakedInStakedMasterChef, 18)
  const totalPendingPlantRewardToSplitNum = 
    getBalanceNumber(totalPendingPlantRewardToSplit, 18) + 
    getBalanceNumber(pendingPlantInPlantMasterGardener, 18)

  const getTotalStakedBalance = () => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const { onUpdate } = useUpdateVerticalGarden(vgId)

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this verticalGarden', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })
  const {
    targetRef: updateRewardTargetRef,
    tooltip: updateRewardTooltip,
    tooltipVisible: updateRewardTooltipVisible,
  } = useTooltip(<div>{t('Updating the contract will claim the pending reward for the contract and make them available for distribution.')}
  <br />{t('The total token earn is counting only token reward that has already been claim.')}
  <br />
  <br />{t('Deposit, Withdraw, Harvest and Compound trigger automatically the update.')}
  <br />
  <br />{t('If you experience issue at sending tx. trigger the update, then try again.')}
</div>, {
    placement: 'bottom',
  })
  const {
    targetRef: rewardCutTargetRef,
    tooltip: rewardCutTooltip,
    tooltipVisible: rewardCutTooltipVisible,
  } = useTooltip(<div>{t('The reward cut is already factor in the apy and pending reward.')}
  <br />
  <br />{t('Usage of the reward cut')}
  <br />
  <br />{t('50% is use to buy PLANT token and burn them')}
  <br />{t('50% is send to the Development Fund to help ecological non profit')}
</div>, {
    placement: 'bottom',
  })

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
              <span ref={totalStakedTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalStakedTooltipVisible && totalStakedTooltip}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{` `}</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Deposit fee')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance small value={1} decimals={2} unit={` %`} />
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Reward cut')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance small value={15} decimals={2} unit={` %`} />
              <span ref={rewardCutTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {rewardCutTooltipVisible && rewardCutTooltip}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total reward pending distribution')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance small value={totalPendingStakedRewardToSplitNum} decimals={3} unit={` ${stakingRewardToken.symbol}`} />
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{` `}</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance small value={totalPendingPlantRewardToSplitNum} decimals={3} unit={` ${verticalEarningToken.symbol}`} />
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      {compoundedReward.toNumber() > 0 && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{t('You previously compounded')}:</Text>
          <Flex alignItems="flex-start">
            {totalStaked ? (
              <>
                <Balance small value={compoundedReward.toNumber()} decimals={4} unit={` ${stakingRewardToken.symbol}`} />
              </>
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
      )}
      {harvestedPlant.toNumber() > 0 && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{t('You previously harvested')}:</Text>
          <Flex alignItems="flex-start">
            {totalStaked ? (
              <>
                <Balance small value={harvestedPlant.toNumber()} decimals={4} unit={` ${verticalEarningToken.symbol}`} />
              </>
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
      )}
      {harvestedReward.toNumber() > 0 && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{` `}</Text>
          <Flex alignItems="flex-start">
            {totalStaked ? (
              <>
                <Balance small value={harvestedReward.toNumber()} decimals={4} unit={` ${stakingRewardToken.symbol}`} />
              </>
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Block count since last update')}:</Text>
        <Flex alignItems="flex-start">
          {lastUpdate ? (
            <>
              <Balance small value={lastUpdate} decimals={0} unit={` blocks`} />
              <span ref={rewardCutTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {rewardCutTooltipVisible && rewardCutTooltip}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Update the reward pending')}:</Text>
        <Flex alignItems="flex-start">
          {account && lastUpdate ? (
            <>
              <UpdateButton
              text={t('Update reward')}
              onClick={async () => {
                await onUpdate()
              }}
            />
              <span ref={updateRewardTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {updateRewardTooltipVisible && updateRewardTooltip}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={`https://plantswap.info/token/${getAddress(stakingRewardToken.address)}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={stakingRewardToken.projectLink} bold={false} small>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            href={`${BASE_BSC_SCAN_URL}/address/${poolContractAddress}`}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex justifyContent="flex-end">
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(tokenAddress, stakingRewardToken.symbol, stakingRewardToken.decimals)}
          >
            <Text color="primary" fontSize="14px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
