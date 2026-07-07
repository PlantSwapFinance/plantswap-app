// Single source of truth for the /project FAQ.
// Used both to render visible Q&A blocks on the page and to emit FAQPage JSON-LD.
// Update both fields together if a question or answer changes — keeping visible
// content and structured data in sync avoids Google's "content mismatch" warning.

export type FAQItem = {
  question: string
  answer: string
}

export const PROJECT_FAQ: FAQItem[] = [
  {
    question: 'What is PlantSwap?',
    answer:
      'PlantSwap is a yield-farming and AMM platform on Binance Smart Chain (BSC) where users earn the $PLANT token through farms and gardens, and where a share of every transaction funds real-world environmental causes like tree planting and rainforest protection.',
  },
  {
    question: 'What problems does PlantSwap solve?',
    answer:
      'Too many BSC DeFi platforms to track — farms, pools, and token prices are scattered across dozens of tabs. Hard to know your real yield — fee tier, APR, impermanent gain and loss are usually invisible. Rug pulls from migrator contracts. And DeFi without a mission. PlantSwap addresses each by consolidating farms into one dashboard, making APR transparent, eliminating migrator code entirely, and routing a share of every transaction to environmental non-profits via the Development Fund.',
  },
  {
    question: 'How is PlantSwap different from other BSC yield farms?',
    answer:
      'PlantSwap has no migrator contract — your liquidity stays where you put it. It auto-detects your other BSC farms and pools, makes APR and profitability transparent per day/month/year, offers one-click controls to revoke spending approvals and emergency-withdraw from other projects, supports auto-compound and auto-harvest on partner farms, and lets you stake single tokens in PlantSwap gardens for hands-off $PLANT yield.',
  },
  {
    question: 'What is the PlantSwap Development Fund?',
    answer:
      'The Development Fund receives 45% to plant trees, 45% burned to lower the total supply, and 10% kept in treasury to cover operating expenses. Every transaction feeds the fund, and donations are published on-chain on the Development Fund page.',
  },
  {
    question: 'How does PlantSwap fund environmental causes?',
    answer:
      'A share of every PlantSwap transaction is routed to the Development Fund, which is governed by the community. Holders of $PLANT vote on which non-profits to support through the Foundation. Donations to environmental partners — including rainforest protection and tree-planting organizations — are recorded on-chain and visible on the Development Fund page.',
  },
  {
    question: 'How do I get started with PlantSwap?',
    answer:
      'Connect a wallet (such as MetaMask) to Binance Smart Chain, then swap tokens on /swap, provide liquidity and stake LP tokens on /farms, or stake single tokens in auto-compounding gardens on /gardens. The full documentation lives on /documentation, and you can see what is next for the project on the /roadmap.',
  },
]
