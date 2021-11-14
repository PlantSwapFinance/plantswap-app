import BigNumber from 'bignumber.js'
import plantswapFoundationNonProfitAbi from 'config/abi/plantswapFoundationNonProfit.json'
import multicall from 'utils/multicall'
import { getFoundationNonProfitAddress } from 'utils/addressHelpers'
import { SerializedBigNumber } from '../types'

type PublicFoundationData = {
  lastProposalId: SerializedBigNumber
  numberActiveProposals: SerializedBigNumber
  numberVotes: SerializedBigNumber
  numberDonnations: SerializedBigNumber
  totalDonations: SerializedBigNumber
}

const fetchFoundationGeneral = async (): Promise<PublicFoundationData> => {
  const calls = [
    {
      address: getFoundationNonProfitAddress(),
      name: 'getLastProposalId',
    },
    {
      address: getFoundationNonProfitAddress(),
      name: 'numberActiveProposals',
    },
    {
      address: getFoundationNonProfitAddress(),
      name: 'numberVotes',
    },
    {
      address: getFoundationNonProfitAddress(),
      name: 'numberDonnations',
    },
    {
      address: getFoundationNonProfitAddress(),
      name: 'totalDonations',
    },
  ]

  const [lastProposalId, numberActiveProposals, numberVotes, numberDonnations, totalDonations] =
    await multicall(plantswapFoundationNonProfitAbi, calls)

  return {
    lastProposalId: new BigNumber(lastProposalId).toJSON(),
    numberActiveProposals: new BigNumber(numberActiveProposals).toJSON(),
    numberVotes: new BigNumber(numberVotes).toJSON(),
    numberDonnations: new BigNumber(numberDonnations).toJSON(),
    totalDonations: new BigNumber(totalDonations).toJSON(),
  }
}

export default fetchFoundationGeneral