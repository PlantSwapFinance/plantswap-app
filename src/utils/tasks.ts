import { Campaign } from 'config/constants/types'
import { TranslatableText } from 'state/types'

export const getTaskTitle = (campaign: Campaign): TranslatableText => {
  return campaign.title
}

export const getTaskDescription = (campaign: Campaign): TranslatableText => {
  return campaign.description
}
