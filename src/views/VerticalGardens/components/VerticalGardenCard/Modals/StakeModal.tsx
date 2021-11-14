import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon, Link } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { VerticalGarden } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import PercentageButton from './PercentageButton'
import useStakeVerticalGarden from '../../../hooks/useStakeVerticalGarden'
import useUnstakeVerticalGarden from '../../../hooks/useUnstakeVerticalGarden'

interface StakeModalProps {
  isBnbPool: boolean
  verticalGarden: VerticalGarden
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const StakeModal: React.FC<StakeModalProps> = ({
  verticalGarden,
  stakingTokenPrice,
  stakingTokenBalance,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { vgId, stakingToken, userData, stakingRewardToken, depositFee } = verticalGarden
  const { stakedBalance } = userData
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useStakeVerticalGarden(vgId)
  const { onUnstake } = useUnstakeVerticalGarden(vgId)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return stakedBalance
    }
    return stakingTokenBalance
  }

  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), stakingToken.decimals)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = new BigNumber(getCalculatedStakingLimit()).dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isRemovingStake) {
      // unstaking
      try {
        await onUnstake(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: stakingRewardToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    } else {
      try {
        // staking
        await onStake(stakeAmount)
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% funds have been staked in the vertical Garden!', {
            symbol: stakingToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    }
  }

  return (
    <Modal
      title={isRemovingStake ? t('Unstake') : t('Stake in Vertical Garden')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.newTrees}
    >
      {depositFee > 0 && (<Text>This Garden has a {depositFee/100}% deposit fee!</Text>)}
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image
            src={`/images/tokens/${getAddress(stakingToken.address)}.png`}
            width={24}
            height={24}
            alt={stakingToken.symbol}
          />
          <Text ml="4px" bold>
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
        decimals={stakingToken.decimals}
      />
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
      </Flex>
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      {!isRemovingStake && (
        <StyledLink external href="/swap">
          <Button width="100%" mt="8px" variant="secondary">
            {t('Get %symbol%', { symbol: stakingToken.symbol })}
          </Button>
        </StyledLink>
      )}
    </Modal>
  )
}

export default StakeModal
