import { TeamMember } from './OrganisationTeam'
import { Address } from './WebsiteAndSocialList'

export interface FormState {
  name: string
  body: string
  donationAddress: string
  teamId: number
  logoUrl: string
  organisationTeam: TeamMember[]
  websiteAndSocialList: Address[]
}
