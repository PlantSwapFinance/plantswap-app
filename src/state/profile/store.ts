import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ProfileState } from 'state/types'
import getProfile, { GetProfileResponse } from './getProfile'

export const initialState: ProfileState = {
  isInitialized: false,
  isLoading: true,
  hasRegistered: false,
  data: null,
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    () => initialState,
    { name: 'profile' },
  ),
)

export const profileFetchStart = (): void => {
  useProfileStore.setState({ isLoading: true }, false, 'profile/profileFetchStart')
}

export const profileFetchSucceeded = (payload: GetProfileResponse): void => {
  const { profile, hasRegistered } = payload
  useProfileStore.setState(
    {
      isInitialized: true,
      isLoading: false,
      hasRegistered,
      data: profile,
    },
    false,
    'profile/profileFetchSucceeded',
  )
}

export const profileFetchFailed = (): void => {
  useProfileStore.setState({ isLoading: false, isInitialized: true }, false, 'profile/profileFetchFailed')
}

export const profileClear = (): void => {
  useProfileStore.setState({ ...initialState, isLoading: false }, false, 'profile/profileClear')
}

export const addPoints = (payload: number): void => {
  useProfileStore.setState(
    (state) => ({
      data: state.data ? { ...state.data, points: state.data.points + payload } : state.data,
    }),
    false,
    'profile/addPoints',
  )
}

/**
 * Async thunk replacement — fetches the profile for an address and
 * stores the result. Errors are swallowed to match pre-migration behaviour
 * (the original thunk dispatched profileFetchFailed on error).
 */
export const fetchProfile = async (address: string): Promise<void> => {
  try {
    profileFetchStart()
    const response = await getProfile(address)
    profileFetchSucceeded(response)
  } catch (error) {
    profileFetchFailed()
  }
}