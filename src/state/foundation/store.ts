import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import BigNumber from 'bignumber.js'
import { FoundationVotingStateLoadingStatus, FoundationVotingState } from 'state/types'
import fetchFoundationGeneral from './fetchFoundationGeneral'

/**
 * NOTE: the original slice had a buggy `.fulfilled` handler that indexed
 * `state.fondationGeneral` by BigNumber values
 * (see https://github.com/PlantSwapFinance/plantswap-app). This migration
 * preserves that behaviour exactly — the legacy `fondationGeneral`
 * field ends up populated with BigNumber-keyed entries on every fetch.
 * Will be cleaned up in a separate PR.
 */
export const initialState: FoundationVotingState = {
  foundationProposalLoadingStatus: FoundationVotingStateLoadingStatus.INITIAL,
  foundationProposals: {},
  foundationVoteLoadingStatus: FoundationVotingStateLoadingStatus.INITIAL,
  foundationVotes: {},
  fondationGeneral: {
    lastProposalId: new BigNumber(0),
    numberActiveProposals: new BigNumber(0),
    numberVotes: new BigNumber(0),
    numberDonnations: new BigNumber(0),
    totalDonations: new BigNumber(0),
  },
}

export const useFoundationStore = create<FoundationVotingState>()(
  devtools(
    () => initialState,
    { name: 'foundation' },
  ),
)

export const fetchFoundation = async (): Promise<void> => {
  useFoundationStore.setState(
    { foundationProposalLoadingStatus: FoundationVotingStateLoadingStatus.LOADING },
    false,
    'foundation/fetchFoundation/pending',
  )
  try {
    const response = await fetchFoundationGeneral()
    useFoundationStore.setState(
      (state) => ({
        // Preserve legacy BigNumber-keyed pollution of `fondationGeneral`.
        fondationGeneral: {
          ...state.fondationGeneral,
          [response.lastProposalId]: response,
          [response.numberActiveProposals]: response,
        },
        foundationProposalLoadingStatus: FoundationVotingStateLoadingStatus.IDLE,
      }),
      false,
      'foundation/fetchFoundation/fulfilled',
    )
  } catch (error) {
    // Pre-migration did not handle .rejected; preserve that behaviour.
    console.error(error)
  }
}