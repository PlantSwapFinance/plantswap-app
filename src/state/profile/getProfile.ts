import Cookies from 'js-cookie'
import { getProfileContract } from 'utils/contractHelpers'
import { Nft } from 'config/constants/types'
import { getNftByTokenId } from 'utils/collectibles'
import usernamesApi from 'utils/calls/usernames'
import usersApi from 'utils/calls/users'
import { Profile } from 'state/types'
import { getTeam } from 'state/teams/helpers'
import { transformProfileResponse } from './helpers'

const profileContract = getProfileContract()
// const profileApi = process.env.REACT_APP_API_PROFILE

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}


const getUsername = async (account): Promise<string> => {
  // Find username in username table or create one
  let accountUsername = ''
  usernamesApi.readUsernameByUserId(account).then((usernames)  => {
    if (usernames.length > 0) {
      accountUsername = usernames[0].data.userId
    }
    else {
      const newUsername = {
        userId: account,
        username: '',
      }
      usernamesApi.createUsernames(newUsername).then(() => null ).catch((err) => {
        console.error(err)
      })
    }
  })
  return accountUsername
}

const getProfile = async (address: string): Promise<GetProfileResponse> => {
  try {
    const hasRegistered = (await profileContract.hasRegistered(address)) as boolean

    if (!hasRegistered) {
      return { hasRegistered, profile: null }
    }

    const profileResponse = await profileContract.getUserProfile(address)
    const { userId, points, teamId, tokenId, accountTypeId, nftAddress, isActive } = transformProfileResponse(profileResponse)
    const team = await getTeam(teamId)
    const username = await getUsername(address)

    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    let nft: Nft
    if (isActive) {
       nft = await getNftByTokenId(nftAddress, tokenId)

      // Save the preview image in a cookie so it can be used on the exchange
      Cookies.set(
        `profile_${address}`,
        {
          username,
          avatar: `https://plantswap.finance/images/nfts/${nft?.images.sm}`,
        },
        { domain: 'plantswap.finance', secure: true, expires: 30 },
      )
    }

    const profile = {
      userId,
      points,
      teamId,
      tokenId,
      accountTypeId,
      username,
      nftAddress,
      isActive,
      nft,
      team,
    } as Profile

    // Find user in users table or create new user
    usersApi.readUserByUserId(address).then((users)  => {
      if (users.length === 0) {
        const newUser = {
          userId: address,
          username: '',
          hasRegistered,
          profile,
        }
        usersApi.createUsers(newUser).then(() => null ).catch((err) => {
          console.error(err)
        })
      }
    })

    return { hasRegistered, profile }
  } catch (error) {
    return null
  }
}

export default getProfile
