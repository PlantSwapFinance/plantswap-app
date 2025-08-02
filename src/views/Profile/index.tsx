import React from 'react'
import { Route } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { EndPage } from '@plantswap/uikit'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import { useProfile } from 'state/profile/hooks'
import { useFetchAchievements } from 'state/achievements/hooks'
import ProfileCreation from './ProfileCreation'
import Header from './components/Header'
import TaskCenter from './TaskCenter'
import PublicProfile from './PublicProfile'

const Profile = () => {
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const { address: account } = useAccount()

  useFetchAchievements()

  if (!isInitialized || isLoading) {
    return <PageLoader />
  }

  if (account && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    )
  }

  return (
    <Page>
      <Header />
      <Route exact path="/profile">
        <PublicProfile />
      </Route>
      <Route path="/profile/tasks">
        <TaskCenter />
      </Route>
      <EndPage />
    </Page>
  )
}

export default Profile
