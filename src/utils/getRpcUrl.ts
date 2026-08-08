import sample from 'lodash/sample'

// Public BSC HTTP endpoints that allow browser CORS. Prefer these over flaky
// third-party relays (e.g. rpc.nodeflare.app returns CORS errors + 429).
const DEFAULT_BSC_NODES = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
]

const isBrowserSafeRpc = (url: string): boolean => {
  if (/nodeflare\.app/i.test(url)) {
    return false
  }
  return true
}

const envNodes = [
  import.meta.env.REACT_APP_NODE_1,
  import.meta.env.REACT_APP_NODE_2,
  import.meta.env.REACT_APP_NODE_3,
].filter((url): url is string => Boolean(url) && isBrowserSafeRpc(url))

// Env nodes first (when safe), then hardcoded public seeds as fallbacks.
export const nodes = [...envNodes, ...DEFAULT_BSC_NODES].filter(
  (url, index, all) => all.indexOf(url) === index,
)

const getNodeUrl = () => {
  return sample(nodes) || DEFAULT_BSC_NODES[0]
}

export default getNodeUrl
