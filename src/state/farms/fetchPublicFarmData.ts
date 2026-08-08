import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
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

const toBn = (value: unknown): BigNumber => {
  if (value === null || value === undefined) {
    return BIG_ZERO
  }
  if (BigNumber.isBigNumber(value)) {
    return value
  }
  // ethers Result / bigint / number / string
  return new BigNumber(value.toString())
}

const fetchFarm = async (farm: Farm): Promise<PublicFarmData> => {
  const { pid, lpAddresses, token, quoteToken, isTokenOnly } = farm
  const lpAddress = getAddress(lpAddresses)

  let lpTokenRatio = BIG_ZERO
  let tokenAmountTotal = BIG_ZERO
  let quoteTokenAmountTotal = BIG_ZERO
  let lpTotalSupplyCount = BIG_ZERO
  let tokenAmountMc = BIG_ZERO
  let quoteTokenAmountMc = BIG_ZERO
  let lpTotalInQuoteToken = BIG_ZERO
  let tokenPriceVsQuote = BIG_ZERO
  let allocPoint = BIG_ZERO
  let poolWeight = BIG_ZERO

  if (isTokenOnly === true) {
    const calls = [
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [getMasterGardenerAddress()],
      },
      {
        address: getAddress(token.address),
        name: 'decimals',
      },
    ]

    const [lpTokenBalanceMC, tokenDecimals] = await multicall(erc20, calls)
    const decimals = Number(tokenDecimals?.toString?.() ?? tokenDecimals ?? 18)
    const balance = toBn(lpTokenBalanceMC).div(BIG_TEN.pow(decimals))

    lpTokenRatio = new BigNumber(100)
    tokenAmountTotal = balance
    quoteTokenAmountTotal = balance
    tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
    quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
    lpTotalInQuoteToken = balance
    // Token-only pools have no LP supply; keep zero rather than reading an unset var.
    lpTotalSupplyCount = BIG_ZERO
    tokenPriceVsQuote = tokenAmountTotal

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

    allocPoint = info ? toBn(info.allocPoint ?? info[1]) : BIG_ZERO
    poolWeight = totalAllocPoint ? allocPoint.div(toBn(totalAllocPoint)) : BIG_ZERO
  } else {
    const calls = [
      {
        address: getAddress(token.address),
        name: 'balanceOf',
        params: [lpAddress],
      },
      {
        address: getAddress(quoteToken.address),
        name: 'balanceOf',
        params: [lpAddress],
      },
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [getMasterGardenerAddress()],
      },
      {
        address: lpAddress,
        name: 'totalSupply',
      },
      {
        address: getAddress(token.address),
        name: 'decimals',
      },
      {
        address: getAddress(quoteToken.address),
        name: 'decimals',
      },
    ]

    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
      await multicall(erc20, calls)

    const tokenDec = Number(tokenDecimals?.toString?.() ?? tokenDecimals ?? 18)
    const quoteDec = Number(quoteTokenDecimals?.toString?.() ?? quoteTokenDecimals ?? 18)
    lpTotalSupplyCount = toBn(lpTotalSupply)
    const lpBalanceMc = toBn(lpTokenBalanceMC)
    lpTokenRatio = lpTotalSupplyCount.gt(0) ? lpBalanceMc.div(lpTotalSupplyCount) : BIG_ZERO

    tokenAmountTotal = toBn(tokenBalanceLP).div(BIG_TEN.pow(tokenDec))
    quoteTokenAmountTotal = toBn(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteDec))
    tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
    quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
    lpTotalInQuoteToken = quoteTokenAmountMc.times(2)
    tokenPriceVsQuote = tokenAmountTotal.gt(0) ? quoteTokenAmountTotal.div(tokenAmountTotal) : BIG_ZERO

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

    allocPoint = info ? toBn(info.allocPoint ?? info[1]) : BIG_ZERO
    poolWeight = totalAllocPoint ? allocPoint.div(toBn(totalAllocPoint)) : BIG_ZERO
  }

  return {
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: lpTotalSupplyCount.toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
  }
}

export default fetchFarm
