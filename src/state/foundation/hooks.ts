import { FoundationProposal, FoundationVote } from 'state/types'
import { useFoundationStore } from './store'

// Foundation voting
export const useGetFoundationProposals = (): FoundationProposal[] => {
  const foundationProposals = useFoundationStore((state) => state.foundationProposals)
  return Object.values(foundationProposals)
}

export const useGetFoundatioProposal = (proposalId: string): FoundationProposal | undefined => {
  return useFoundationStore((state) => state.foundationProposals[proposalId])
}

export const useGetFoundatioVotes = (proposalId: string): FoundationVote[] => {
  const foundationVotes = useFoundationStore((state) => state.foundationVotes[proposalId])
  return foundationVotes ? foundationVotes.filter((vote) => vote._inValid !== true) : []
}

export const useGetFoundatioVotingStateLoadingStatus = () => {
  return useFoundationStore((state) => state.foundationVoteLoadingStatus)
}

export const useGetFoundatioProposalLoadingStatus = () => {
  return useFoundationStore((state) => state.foundationProposalLoadingStatus)
}