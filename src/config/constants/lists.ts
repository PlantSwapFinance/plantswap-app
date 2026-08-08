// PancakeSwap token CDN (tokens.plantswap.finance no longer resolves reliably)
const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'
const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'

const PLANTSWAP_NFT = 'https://plantswap.finance/lists/plantswap-nft-list.json'
const PANCAKE_NFT = 'https://plantswap.finance/lists/pancakeswap-nft-list.json'

export const UNSUPPORTED_LIST_URLS: string[] = []
export const UNSUPPORTED_NFTLIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_TOP100,
  PANCAKE_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// lower index == higher priority for token import
export const DEFAULT_NFTLIST_OF_LISTS: string[] = [
  PLANTSWAP_NFT,
  PANCAKE_NFT,
  ...UNSUPPORTED_NFTLIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_NFTLIST_URLS: string[] = []
