import sample from 'lodash/sample'

// Public BSC HTTP endpoints that allow browser CORS.
const DEFAULT_BSC_NODES = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
]

/** Drop hosts known to fail in the browser (CORS, DNS, or rate limits). */
const isBrowserSafeRpc = (url: string): boolean => {
  if (/nodeflare\.app/i.test(url)) return false
  if (/llamarpc\.com/i.test(url)) return false
  return true
}

const envNodes = [
  import.meta.env.REACT_APP_NODE_1,
  import.meta.env.REACT_APP_NODE_2,
  import.meta.env.REACT_APP_NODE_3,
].filter((url): url is string => Boolean(url) && isBrowserSafeRpc(url))

// Prefer safe env nodes; always keep public seeds as fallbacks.
export const nodes = [...envNodes, ...DEFAULT_BSC_NODES].filter(
  (url, index, all) => all.indexOf(url) === index,
)

const getNodeUrl = () => {
  return sample(nodes) || DEFAULT_BSC_NODES[0]
}

export default getNodeUrl
