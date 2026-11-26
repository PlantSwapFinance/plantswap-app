import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, Text, Heading } from '@plantswap/uikit'
import { Link, useLocation } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Balance from 'components/Balance'
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks'
import { fetchFarmUserDataAsync } from 'state/farms'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useTranslation } from 'contexts/Localization'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useAppDispatch } from 'state'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { PoolDepositModal as DepositModal, PoolWithdrawModal as WithdrawModal } from 'components/PoolModals'
import useStakePool from 'hooks/useStakePool'
import useUnstakePool from 'hooks/useUnstakePool'
import { getErrorReason, trackEvent } from 'utils/analytics'
import useFarmApprove from '../../../hooks/useFarmApprove'
import getFarmTokenPath from '../../../getFarmTokenPath'
import { ActionContainer, ActionTitles, ActionContent } from './styles'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'

const IconButtonWrapper = styled.div`
  display: flex;
`

// Approve / get-LP states carry a helper line under the button, so let them grow past the fixed row height.
const ApprovalActionContainer = styled(ActionContainer)`
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  depositFee,
  isTokenOnly,
  multiplier,
  userDataReady,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStakePool(pid)
  const { onUnstake } = useUnstakePool(pid)
  const location = useLocation()
  const lpPrice = useLpTokenPrice(lpSymbol)

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = getAddress(lpAddresses)
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleStake = async (amount: string) => {
    const params = { funnel: 'farm', farm_pid: pid, token_symbol: lpSymbol }
    trackEvent('stake_start', params)
    try {
      await onStake(amount)
    } catch (e) {
      trackEvent('stake_error', { ...params, reason: getErrorReason(e) })
      throw e
    }
    trackEvent('stake_success', params)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      addLiquidityUrl={addLiquidityUrl}
      depositFee={depositFee}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )
  const dispatch = useAppDispatch()
  const { handleApprove, requestedApproval } = useFarmApprove(lpAddress, pid, lpSymbol, account)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
              {lpSymbol}
            </Text>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t('Staked')}
            </Text>
          </ActionTitles>
          <ActionContent>
            <div>
              <Heading>{displayBalance()}</Heading>
              {stakedBalance.gt(0) && lpPrice.gt(0) && (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={getBalanceNumber(lpPrice.times(stakedBalance))}
                  unit=" USD"
                  prefix="~"
                />
              )}
            </div>
            <IconButtonWrapper>
              <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="primary" width="14px" />
              </IconButton>
              <IconButton
                variant="secondary"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
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
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
            {t('Stake').toUpperCase()}
          </Text>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
            {lpSymbol}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          >
            {t('Stake LP')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  // Finished farms (0X) should not steer users to acquire tokens they cannot farm.
  if (multiplier !== '0X' && tokenBalance.isZero() && stakedBalance.isZero()) {
    return (
      <ApprovalActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            as={Link}
            to={getFarmTokenPath({ isTokenOnly, token, quoteToken })}
            onClick={() => trackEvent('get_lp_click', { funnel: 'farm', farm_pid: pid, token_symbol: lpSymbol })}
          >
            {t('Get %symbol%', { symbol: lpSymbol })}
          </Button>
        </ActionContent>
        <Text fontSize="12px" color="textSubtle" mt="4px">
          {t('You have no %symbol% to stake yet. Get some, then come back to stake.', { symbol: lpSymbol })}
        </Text>
      </ApprovalActionContainer>
    )
  }

  return (
    <ApprovalActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Start Farming')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Approve %symbol%', { symbol: lpSymbol })}
        </Button>
      </ActionContent>
      <Text fontSize="12px" color="textSubtle" mt="4px">
        {t('Step 1 of 2: allow the PlantSwap farm contract to use your %symbol%. Small network fee, no funds move.', {
          symbol: lpSymbol,
        })}
      </Text>
    </ApprovalActionContainer>
  )
}

export default Staked
