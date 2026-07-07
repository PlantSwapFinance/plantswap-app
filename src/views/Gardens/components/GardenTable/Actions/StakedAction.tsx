import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, Text, Heading } from '@plantswap/uikit'
import { useLocation } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Balance from 'components/Balance'
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks'
import { fetchFarmUserDataAsync } from 'state/farms'
import { GardenWithStakedValue } from 'views/Gardens/components/GardenCard/GardenCard'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useAppDispatch } from 'state'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { PoolDepositModal, PoolWithdrawModal } from 'components/PoolModals'
import useApprovePool from 'hooks/useApprovePool'
import useStakePool from 'hooks/useStakePool'
import useUnstakePool from 'hooks/useUnstakePool'
import { ActionContainer, ActionTitles, ActionContent } from './styles'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends GardenWithStakedValue {
  userDataReady: boolean
  depositFee?: number
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  depositFee,
  userDataReady,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
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
    await onStake(amount)
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
    <PoolDepositModal
      max={tokenBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      addLiquidityUrl={addLiquidityUrl}
      depositFee={depositFee}
      featureLabel="garden"
      useLp={false}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <PoolWithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} useLp={false} />,
  )
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()
  const { onApprove } = useApprovePool(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))

      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Gardening')}
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
            {t('Stake Token')}
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
            {t('Start Gardening')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Enable Garden')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
