import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/mastergardener.json'
import erc20 from 'config/abi/erc20.json'
import { getAddress, getMasterGardenerAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { Farm, SerializedBigNumber } from '../types'

type PublicFarmData = {
  tokenAmountMc: SerializedBigNumber
  quoteTokenAmountMc: SerializedBigNumber
  tokenAmountTotal: SerializedBigNumber
  quoteTokenAmountTotal: SerializedBigNumber
  lpTotalInQuoteToken: SerializedBigNumber
  lpTotalSupply: SerializedBigNumber
  tokenPriceVsQuote: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
}

const fetchFarm = async (farm: Farm): Promise<PublicFarmData> => {
  const { pid, lpAddresses, token, quoteToken, isTokenOnly } = farm
  const lpAddress = getAddress(lpAddresses)

  let calls
  let lpTokenRatio
  let tokenAmountTotal
  let quoteTokenAmountTotal
  let lpTotalSupplyCount
  let tokenAmountMc
  let quoteTokenAmountMc
  let lpTotalInQuoteToken
  let tokenPriceVsQuote
  let allocPoint
  let poolWeight

  if(isTokenOnly === true) {
    calls = [
      // Balance of LP tokens in the master chef contract
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [getMasterGardenerAddress()],
      },
      // Token decimals
      {
        address: getAddress(token.address),
        name: 'decimals',
      },
    ]

    const [lpTokenBalanceMC, tokenDecimals] =
      await multicall(erc20, calls)

    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    lpTokenRatio = new BigNumber(100)

    // Raw amount of token in the LP, including those not staked
    tokenAmountTotal = new BigNumber(lpTokenBalanceMC).div(BIG_TEN.pow(tokenDecimals))
    quoteTokenAmountTotal = new BigNumber(lpTokenBalanceMC).div(BIG_TEN.pow(tokenDecimals))

    // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
    tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
    quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

    // Total staked in LP, in quote token value
    lpTotalInQuoteToken = new BigNumber(lpTokenBalanceMC).div(BIG_TEN.pow(tokenDecimals))

    tokenPriceVsQuote = tokenAmountTotal

    // Only make masterchef calls if farm has pid
    const [info, totalAllocPoint] =
      pid || pid === 0
        ? await multicall(masterchefABI, [
            {
              address: getMasterGardenerAddress(),
              name: 'poolInfo',
              params: [pid],
            },
            {
              address: getMasterGardenerAddress(),
              name: 'totalAllocPoint',
            },
          ])
        : [null, null]

    allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  }
  else {
    calls = [
      // Balance of token in the LP contract
      {
        address: getAddress(token.address),
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of quote token on LP contract
      {
        address: getAddress(quoteToken.address),
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of LP tokens in the master chef contract
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [getMasterGardenerAddress()],
      },
      // Total supply of LP tokens
      {
        address: lpAddress,
        name: 'totalSupply',
      },
      // Token decimals
      {
        address: getAddress(token.address),
        name: 'decimals',
      },
      // Quote token decimals
      {
        address: getAddress(quoteToken.address),
        name: 'decimals',
      },
    ]

    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
      await multicall(erc20, calls)

    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

    // Raw amount of token in the LP, including those not staked
    tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
    quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))
    lpTotalSupplyCount = lpTotalSupply
    // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
    tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
    quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

    // Total staked in LP, in quote token value
    lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

    tokenPriceVsQuote = quoteTokenAmountTotal.div(tokenAmountTotal)

    // Only make masterchef calls if farm has pid
    const [info, totalAllocPoint] =
      pid || pid === 0
        ? await multicall(masterchefABI, [
            {
              address: getMasterGardenerAddress(),
              name: 'poolInfo',
              params: [pid],
            },
            {
              address: getMasterGardenerAddress(),
              name: 'totalAllocPoint',
            },
          ])
        : [null, null]

    allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  }

  return {
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupplyCount).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
  }
}

export default fetchFarm
