import { SalesSectionProps } from '.'

export const proposeSectionData: SalesSectionProps = {
  headingText: 'Propose ecological foundations worthy of our donations',
  bodyText:
    'The first step in the process is to create an open list of ecological foundations, that every Gardener can help complete or validate the trustworthiness of the participant.',
  reverse: false,
  primaryButton: {
    to: '/foundation/proposal/create',
    text: 'Propose a ecological non-profit',
    external: false,
  },
  secondaryButton: {
    to: '/foundation',
    text: 'Validate proposals',
    external: true,
  },

  images: {
    path: '/images/foundation/plant/',
    attributes: [
      { src: 'top-right', alt: 'Small 3d plant' },
    ],
  },
}

export const donateSectionData: SalesSectionProps = {
  headingText: 'Donate to the Plantswap Development foundation',
  bodyText: 'Help to raise even more capital by doing a donation. The token collected will be sent to community-approved ecological foundations.',
  reverse: true,
  primaryButton: {
    to: '/foundation/donate',
    text: 'Donate',
    external: false,
  },
  secondaryButton: {
    to: '/foundation',
    text: 'Others way to contribute',
    external: true,
  },
  images: {
    path: '/images/foundation/donation/',
    attributes: [
      { src: 'RoundLove', alt: 'Folder with cake token' },
      { src: 'HandsWithLove', alt: 'Pie chart' },
      { src: 'HandWithTree', alt: 'Stocks chart' },
    ],
  },
}