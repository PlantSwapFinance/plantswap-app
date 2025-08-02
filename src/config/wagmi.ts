import { http, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '2f5a2129a4d6ab6c654dcdbffc8e5a41'

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'PlantSwap Finance',
        description: 'PlantSwap Finance - DeFi Platform',
        url: 'https://plantswap.finance',
        icons: ['https://plantswap.finance/favicon.ico']
      }
    }),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
})