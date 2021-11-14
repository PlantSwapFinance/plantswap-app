import { SalesSectionProps } from '.'

export const plantSectionData: SalesSectionProps = {
  headingText: 'Farm $PLANT with us and save the planet🌱',
  bodyText:
    'Stake and Farm $PLANT token in our farms and gardens.🌱',
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x58BA5Bd8872ec18BD360a9592149daed2fC57c69',
    text: 'Buy PLANT',
    external: false,
  },
  secondaryButton: {
    to: '/farms',
    text: 'Farm PLANT',
    external: true,
  },

  images: {
    path: '/images/home/plant/',
    attributes: [
      { src: 'top-right', alt: 'Small 3d plant' },
    ],
  },
}
