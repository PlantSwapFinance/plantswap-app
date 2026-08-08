import { JsonRpcProvider, Network } from 'ethers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const chainId = parseInt(import.meta.env.REACT_APP_CHAIN_ID ?? '56', 10)
const network = Network.from(chainId)

// staticNetwork avoids eth_blockNumber probes on a fixed HTTP seed URL.
export const simpleRpcProvider = new JsonRpcProvider(RPC_URL, network, { staticNetwork: network })

export default null
