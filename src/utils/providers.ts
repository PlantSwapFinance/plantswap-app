import { JsonRpcProvider } from 'ethers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()

// JsonRpcProvider is network-aware in v6; the same constructor works for HTTP URLs.
export const simpleRpcProvider = new JsonRpcProvider(RPC_URL)

export default null
