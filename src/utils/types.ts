import { Contract } from 'ethers'

export type MultiCallResponse<T> = T | null

// Chainlink Orance
export type ChainLinkOracleLatestAnswerResponse = bigint

export interface ChainLinkOracleContract extends Contract {
  latestAnswer: ContractFunction<ChainLinkOracleLatestAnswerResponse>
}

// Farm Auction

// Note: slightly different from AuctionStatus used thoughout UI
export enum FarmAuctionContractStatus {
  Pending,
  Open,
  Close,
}

export interface AuctionsResponse {
  status: FarmAuctionContractStatus
  startBlock: bigint
  endBlock: bigint
  initialBidAmount: bigint
  leaderboard: bigint
  leaderboardThreshold: bigint
}

export interface BidsPerAuction {
  account: string
  amount: bigint
}

export type ViewBidsPerAuctionResponse = [BidsPerAuction[], bigint]

// [auctionId, bids, claimed, nextCursor]
export type ViewBidderAuctionsResponse = [bigint[], bigint[], boolean[], bigint]

type GetWhitelistedAddressesResponse = [
  {
    account: string
    lpToken: string
    token: string
  }[],
  bigint,
]

interface AuctionsHistoryResponse {
  totalAmount: bigint
  hasClaimed: boolean
}

export interface FarmAuctionContract extends Contract {
  currentAuctionId: ContractFunction<bigint>
  viewBidders: ContractFunction<[string[], bigint]>
  totalCollected: ContractFunction<bigint>
  auctions: ContractFunction<AuctionsResponse>
  claimable: ContractFunction<boolean>
  viewBidsPerAuction: ContractFunction<ViewBidsPerAuctionResponse>
  viewBidderAuctions: ContractFunction<ViewBidderAuctionsResponse>
  whitelisted: ContractFunction<boolean>
  getWhitelistedAddresses: ContractFunction<GetWhitelistedAddressesResponse>
  auctionsHistory: ContractFunction<AuctionsHistoryResponse>
}
