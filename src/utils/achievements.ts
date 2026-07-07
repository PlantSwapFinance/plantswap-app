import { Campaign } from 'config/constants/types'
import { TranslatableText } from 'state/types'

export const getAchievementTitle = (campaign: Campaign): TranslatableText => {
  return campaign.title
}

export const getAchievementDescription = (campaign: Campaign): TranslatableText => {
  return campaign.description
}
