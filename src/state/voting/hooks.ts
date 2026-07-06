import { Proposal, Vote } from 'state/types'
import { useVotingStore } from './store'

// Voting
export const useGetProposals = (): Proposal[] => {
  const proposals = useVotingStore((state) => state.proposals)
  return Object.values(proposals)
}

export const useGetProposal = (proposalId: string): Proposal | undefined => {
  return useVotingStore((state) => state.proposals[proposalId])
}

export const useGetVotes = (proposalId: string): Vote[] => {
  const votes = useVotingStore((state) => state.votes[proposalId])
  return votes ? votes.filter((vote) => vote._inValid !== true) : []
}

export const useGetVotingStateLoadingStatus = () => {
  return useVotingStore((state) => state.voteLoadingStatus)
}

export const useGetProposalLoadingStatus = () => {
  return useVotingStore((state) => state.proposalLoadingStatus)
}