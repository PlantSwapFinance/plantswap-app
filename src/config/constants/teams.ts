import { Team } from './types'

const teams: Team[] = [
  {
    id: 1,
    name: 'Rainforest',
    description: "Rainforest Protection",
    images: {
      lg: 'rainforest-lg.png',
      md: 'rainforest-md.png',
      sm: 'rainforest-sm.png',
      alt: 'rainforest-alt.png',
      ipfs: 'https://gateway.pinata.cloud/ipfs/Qmbp8jdLGsfGiobWFnrQaCK68ytigTjcT3KWfhvaPamSKr',
    },
    background: 'rainforest-bg.svg',
    textColor: '#D85E41',
    users: 0,
    points: 0,
  },
  {
    id: 2,
    name: 'NewTrees',
    description: "Planting new trees",
    images: {
      lg: 'newtrees-lg.png',
      md: 'newtrees-md.png',
      sm: 'newtrees-sm.png',
      alt: 'newtrees-alt.png',
      ipfs: 'https://gateway.pinata.cloud/ipfs/QmVpakJhL4jsEU66f1FnHcCkQM2xkB8dy7DE6AjWZbKv1P',
    },
    background: 'newtrees-bg.svg',
    textColor: '#5D241D',
    users: 0,
    points: 0,
  },
  {
    id: 3,
    name: 'Wildlife',
    description: 'Nature & Wildlife conservancy',
    images: {
      lg: 'wildlife-lg.png',
      md: 'wildlife-md.png',
      sm: 'wildlife-sm.png',
      alt: 'wildlife-alt.png',
      ipfs: 'https://gateway.pinata.cloud/ipfs/QmfSBDsmHRodNyhdsZQPW9mft7R3WCsNB34iXeCiHn7CxA',
    },
    background: 'wildlife-bg.svg',
    textColor: '#674447',
    users: 0,
    points: 0,
  },
]

export default teams
