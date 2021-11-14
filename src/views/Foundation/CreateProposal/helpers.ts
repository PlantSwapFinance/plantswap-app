import { ContextApi } from 'contexts/Localization/types'
import { format, parseISO, isValid } from 'date-fns'
import { MINIMUM_CHOICES, } from './OrganisationTeam'
import { MINIMUM_ADDRESS, } from './WebsiteAndSocialList'
import { FormState } from './types'

export const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null
  }

  const dateStr = format(date, 'yyyy-MM-dd')
  const timeStr = format(time, 'HH:mm:ss')

  return parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3
}

export const getFormErrors = (formData: FormState, t: ContextApi['t']) => {
  const { name, donationAddress, logoUrl, body, organisationTeam, websiteAndSocialList } = formData
  const errors: { [key: string]: string[] } = {}

  if (!name) {
    errors.name = [t('%field% is required', { field: 'Organisation Name' })]
  }

  if (!donationAddress) {
    errors.donationAddress = [t('%field% is required', { field: 'Donation address' })]
  }

  if (!logoUrl) {
    errors.logoUrl = [t('%field% is required', { logoUrl: 'Organisation logo' })]
  }

  if (!body) {
    errors.body = [t('%field% is required', { field: 'Body' })]
  }

  if (organisationTeam.length < MINIMUM_CHOICES) {
    errors.organisationTeam = [t('Please create a minimum of %num% organisationTeam', { num: MINIMUM_CHOICES })]
  }

  const hasEmptyChoice = organisationTeam.some((choice) => !choice.value)
  if (organisationTeam.length === MINIMUM_CHOICES && hasEmptyChoice) {
    errors.organisationTeam = Array.isArray(errors.organisationTeam)
      ? [...errors.organisationTeam, t('Choices must not be empty')]
      : (errors.organisationTeam = [t('Choices must not be empty')])
  }

  if (websiteAndSocialList.length < MINIMUM_ADDRESS) {
    errors.websiteAndSocialList = [t('Please create a minimum of %num% organisationTeam', { num: MINIMUM_ADDRESS })]
  }

  const hasEmptyAddressList = websiteAndSocialList.some((address) => !address.value)
  if (websiteAndSocialList.length === MINIMUM_ADDRESS && hasEmptyAddressList) {
    errors.websiteAndSocialList = Array.isArray(errors.websiteAndSocialList)
      ? [...errors.websiteAndSocialList, t('Address must not be empty')]
      : (errors.websiteAndSocialList = [t('Address must not be empty')])
  }

  return errors
}
