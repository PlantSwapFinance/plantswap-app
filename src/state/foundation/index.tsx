import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { FoundationVotingStateLoadingStatus, FoundationVotingState } from 'state/types'
import fetchFoundationGeneral from './fetchFoundationGeneral'

const initialState: FoundationVotingState = {
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

export const fetchFoundation = createAsyncThunk(
  'foundation/fetchFoundation',
  async () => {
    const response = await fetchFoundationGeneral()

    return response
  },
) 

export const foundationSlice = createSlice({
  name: 'foundation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // Fetch Proposals
    builder.addCase(fetchFoundation.pending, (state) => {
      state.foundationProposalLoadingStatus = FoundationVotingStateLoadingStatus.LOADING
    })
    builder.addCase(fetchFoundation.fulfilled, (state, action) => {
      state.fondationGeneral[action.payload.lastProposalId] = action.payload
      state.fondationGeneral[action.payload.numberActiveProposals] = action.payload
      state.foundationProposalLoadingStatus = FoundationVotingStateLoadingStatus.IDLE
 
   })
  },
}) 

export default foundationSlice.reducer