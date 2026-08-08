import sample from 'lodash/sample'

const FALLBACK_RPC = 'https://bsc-dataseed.binance.org'

// Array of available nodes to connect to (drop unset env entries)
export const nodes = [
  import.meta.env.REACT_APP_NODE_1,
  import.meta.env.REACT_APP_NODE_2,
  import.meta.env.REACT_APP_NODE_3,
].filter((url): url is string => Boolean(url))

const getNodeUrl = () => {
  return sample(nodes) || FALLBACK_RPC
}

export default getNodeUrl
