import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { merge } from 'lodash'
import { Proposal, ProposalState, VotingStateLoadingStatus, VotingState } from 'state/types'
import { getAllVotes, getProposal, getProposals, getVoteVerificationStatuses } from './helpers'

export const initialState: VotingState = {
  proposalLoadingStatus: VotingStateLoadingStatus.INITIAL,
  proposals: {},
  voteLoadingStatus: VotingStateLoadingStatus.INITIAL,
  votes: {},
}

export const useVotingStore = create<VotingState>()(
  devtools(
    () => initialState,
    { name: 'voting' },
  ),
)

/**
 * Alias of `useVotingStore` preserving the legacy `state.foundationVoting`
 * accessor path. Pre-migration the Redux store registered the voting
 * reducer under two keys (voting AND foundationVoting); consumers like
 * `useGetFoundationProposals` read `state.foundationVoting.foundationProposals`.
 * The new foundation store owns the foundation-shaped state — see
 * `./foundation/store`. This alias is therefore safe to keep for any
 * code that referenced `state.voting` directly via the duplicate
 * registration.
 */
export const useFoundationVotingStore = useVotingStore

export const fetchProposals = async ({
  first,
  skip = 0,
  state = ProposalState.ACTIVE,
}: {
  first?: number
  skip?: number
  state?: ProposalState
}): Promise<void> => {
  useVotingStore.setState({ proposalLoadingStatus: VotingStateLoadingStatus.LOADING }, false, 'voting/fetchProposals/pending')
  try {
    const response = await getProposals(first, skip, state)
    const proposals = response.reduce<{ [id: string]: Proposal }>((accum, proposal) => {
      return { ...accum, [proposal.id]: proposal }
    }, {})
    useVotingStore.setState(
      (current) => ({
        proposals: merge({}, current.proposals, proposals),
        proposalLoadingStatus: VotingStateLoadingStatus.IDLE,
      }),
      false,
      'voting/fetchProposals/fulfilled',
    )
  } catch (error) {
    // Pre-migration did not handle .rejected; preserve that behaviour.
    console.error(error)
  }
}

export const fetchProposal = async (proposalId: string): Promise<void> => {
  useVotingStore.setState({ proposalLoadingStatus: VotingStateLoadingStatus.LOADING }, false, 'voting/fetchProposal/pending')
  try {
    const response = await getProposal(proposalId)
    useVotingStore.setState(
      (current) => ({
        proposals: { ...current.proposals, [response.id]: response },
        proposalLoadingStatus: VotingStateLoadingStatus.IDLE,
      }),
      false,
      'voting/fetchProposal/fulfilled',
    )
  } catch (error) {
    console.error(error)
  }
}

export const fetchVotes = async ({ proposalId, block }: { proposalId: string; block?: number }): Promise<void> => {
  useVotingStore.setState({ voteLoadingStatus: VotingStateLoadingStatus.LOADING }, false, 'voting/fetchVotes/pending')
  try {
    const response = await getAllVotes(proposalId, block)
    useVotingStore.setState(
      (current) => ({
        votes: { ...current.votes, [proposalId]: response },
        voteLoadingStatus: VotingStateLoadingStatus.IDLE,
      }),
      false,
      'voting/fetchVotes/fulfilled',
    )
  } catch (error) {
    console.error(error)
  }
}

export const verifyVotes = async ({
  proposalId,
  snapshot,
}: {
  proposalId: string
  snapshot?: string
}): Promise<void> => {
  try {
    const proposalVotes = useVotingStore.getState().votes[proposalId]
    const response = await getVoteVerificationStatuses(proposalVotes, Number(snapshot))
    const results = response
    useVotingStore.setState(
      (current) => {
        if (!current.votes[proposalId]) return current
        return {
          ...current,
          votes: {
            ...current.votes,
            [proposalId]: current.votes[proposalId].map((vote) => ({
              ...vote,
              _inValid: results[vote.id] === false,
            })),
          },
        }
      },
      false,
      'voting/verifyVotes/fulfilled',
    )
  } catch (error) {
    console.error(error)
  }
}