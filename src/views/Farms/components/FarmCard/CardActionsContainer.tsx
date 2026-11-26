import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'
import { Button, Flex, Text } from '@plantswap/uikit'
import { getAddress } from 'utils/addressHelpers'
import { Farm } from 'state/types'
import { useFarms } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useFarmApprove from '../../hooks/useFarmApprove'
import getFarmTokenPath from '../../getFarmTokenPath'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const { pid, lpAddresses, depositFee } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const earnings = new BigNumber(earningsAsString)
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const { userDataLoaded } = useFarms()
  // Only steer to "Get LP" once balances are known, so it never flashes before user data loads.
  const hasNothingToStake = userDataLoaded && tokenBalance.isZero() && stakedBalance.isZero()

  const { handleApprove, requestedApproval } = useFarmApprove(lpAddress, pid, farm.lpSymbol, account)

  const renderApproval = () => {
    if (hasNothingToStake) {
      return (
        <>
          <Button mt="8px" width="100%" as={Link} to={getFarmTokenPath(farm)}>
            {t('Get %symbol%', { symbol: farm.lpSymbol })}
          </Button>
          <Text fontSize="12px" color="textSubtle" mt="4px">
            {t('You have no %symbol% to stake yet. Get some, then come back to stake.', { symbol: farm.lpSymbol })}
          </Text>
        </>
      )
    }
    return (
      <>
        <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
          {t('Approve %symbol%', { symbol: farm.lpSymbol })}
        </Button>
        <Text fontSize="12px" color="textSubtle" mt="4px">
          {t('Step 1 of 2: allow the PlantSwap farm contract to use your %symbol%. Small network fee, no funds move.', {
            symbol: farm.lpSymbol,
          })}
        </Text>
      </>
    )
  }

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
        depositFee={depositFee}
      />
    ) : (
      renderApproval()
    )
  }

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          PLANT
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} />
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
