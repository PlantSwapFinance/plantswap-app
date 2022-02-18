import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { farmsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { nanoid } from 'nanoid'
import unchainedDatas from 'utils/calls/unchainedDatas'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, nonArchivedFarms } from '.'
import { State, Farm, FarmsState } from '../types'

interface UnchainedData {
  dataType: string
  value: string
  dateAdded: Date
  dateUpdated: Date
}

interface UnchainedLogData extends UnchainedData {
  dataId: string
  userId: string
}

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([4, 28]))
  }, [dispatch, fastRefresh])
}

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// /!\ Deprecated , use the BUSD hook in /hooks

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(28)
  return new BigNumber(bnbBusdFarm.token.busdPrice)
}

export const usePricePlantBusd = (): BigNumber => {
  const [dataCheck, setDataCheck] = useState(false)
  const [dataMissingCheck, setDataMissingCheck] = useState(false)
  const plantBnbFarm = useFarmFromPid(4)
  const plantBnbBusdPrice = plantBnbFarm.token.busdPrice
  const [unchainedPrice, setUnchainedPrice] = useState<string>(plantBnbBusdPrice)

  if (plantBnbBusdPrice !== undefined) {
    const priceData: UnchainedData = {
      dataType: 'plantPrice',
      value: plantBnbBusdPrice,
      dateAdded: new Date(),
      dateUpdated: new Date()
    }
    const priceLogData: UnchainedLogData = {
      ...priceData,
      dataId: nanoid(),
      userId: 'test'
    }
    if (!dataCheck) {
      setDataCheck(true)
      unchainedDatas.readUnchainedDatasByDataType('plantPrice').then((foundUnchainedData) => {
        if (foundUnchainedData[0].data) {
          unchainedDatas.updateUnchainedDatas(foundUnchainedData[0].ref["@ref"].id, priceData);
        }
      }).catch(() => {
        unchainedDatas.createUnchainedDatas(priceData)
      })
      unchainedDatas.createUnchainedLogDatas(priceLogData)
    }
  }
  else {
    // eslint-disable-next-line
    if (!dataMissingCheck) {
      setDataMissingCheck(true)
      unchainedDatas.readUnchainedDatasByDataType('plantPrice').then((foundUnchainedData) => {
        if (foundUnchainedData[0].data) {
          setUnchainedPrice(foundUnchainedData[0].data.value)
        }
      })
    }
  }
  return new BigNumber(unchainedPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  const plantBnbFarm = useFarmFromPid(29)
  return new BigNumber(plantBnbFarm.token.busdPrice)
}
