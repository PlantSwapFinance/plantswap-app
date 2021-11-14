import { useSelector } from 'react-redux'
import { State } from '../types'

// Voting
export const useGetFoundationProposals = () => {
  const foundationProposals = useSelector((state: State) => state.foundationVoting.foundationProposals)
  return Object.values(foundationProposals)
}

export const useGetFoundatioProposal = (proposalId: string) => {
  const foundationProposal = useSelector((state: State) => state.foundationVoting.foundationProposals[proposalId])
  return foundationProposal
}

export const useGetFoundatioVotes = (proposalId: string) => {
  const foundationVotes = useSelector((state: State) => state.foundationVoting.foundationVotes[proposalId])
  return foundationVotes ? foundationVotes.filter((vote) => vote._inValid !== true) : []
}

export const useGetFoundatioVotingStateLoadingStatus = () => {
  const foundationVotingStatus = useSelector((state: State) => state.foundationVoting.foundationVoteLoadingStatus)
  return foundationVotingStatus
}

export const useGetFoundatioProposalLoadingStatus = () => {
  const foundationVotingStatus = useSelector((state: State) => state.foundationVoting.foundationProposalLoadingStatus)
  return foundationVotingStatus
}
