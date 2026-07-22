import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import usersApi from 'utils/calls/users'

import Page from 'components/Layout/Page'
import Header from './components/Header'
import Main from './Main'
import UsersList from './UsersList'
import UsersAccess from './UsersAccess'
import UsersType from './UsersType'
import UsernamesList from './UsernamesList'
import PagesList from './PagesList'
import PagesAccess from './PagesAccess'

import NotFound from '../NotFound'

const Dashboard = ({ userId }) => {

  const [userAccess, setUserAccess] = useState([])
  const [userAccessLoaded, setUserAccessLoaded] = useState(false)
  const [userTypeAccess, setUserTypeAccess] = useState([])
  const [userTypeAccessLoaded, setUserTypeAccessLoaded] = useState(false)
  const buildRoutes = []

  // Fetch user access once userId is known. Side effects (network calls) must
  // not run in the render body — StrictMode would double-fire them and any
  // re-render before the response resolves would queue an extra request. The
  // effect must be declared before any early return to satisfy the rules of
  // hooks.
  useEffect(() => {
    let cancelled = false
    if (!userId || userId === '0x0') {
      return undefined
    }
    if (!userAccessLoaded) {
      usersApi.readUserAccessByUserId(userId).then((res) => {
        if (!cancelled) {
          setUserAccess(res)
          setUserAccessLoaded(true)
        }
      }).catch(err => {
        if (!cancelled) {
          console.error(err)
        }
      })
    }
    if (!userTypeAccessLoaded) {
      usersApi.readUserByUserId(userId).then(res => {
        if (cancelled) return null
        return usersApi.readUserAccessByUserTypeCode(res[0].data.userType)
      }).then(response => {
        if (!cancelled && response) {
          setUserTypeAccess(response)
          setUserTypeAccessLoaded(true)
        }
      }).catch(err => {
        if (!cancelled) {
          console.error(err)
        }
      })
    }
    return () => {
      cancelled = true
    }
    // Only re-run when userId changes; userAccessLoaded/userTypeAccessLoaded
    // toggles are handled by the early-return guards above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if(userId === '0x0') {
    return <NotFound />
  }

  const handleAddRoute = (route) => {
    /* Users */
    if (route === 'dashboard-users') {
      buildRoutes.push(<Route key="users" path="users" element={<UsersList />} />)
    }
    if (route === 'dashboard-usersAccess') {
      buildRoutes.push(<Route key="usersAccess" path="usersAccess" element={<UsersAccess />} />)
    }
    if (route === 'dashboard-usersType') {
      buildRoutes.push(<Route key="usersType" path="usersType" element={<UsersType />} />)
    }
    if (route === 'dashboard-usernames') {
      buildRoutes.push(<Route key="usernames" path="usernames" element={<UsernamesList />} />)
    }
    /* Pages */
    if (route === 'dashboard-pages') {
      buildRoutes.push(<Route key="pages" path="pages" element={<PagesList />} />)
    }
    if (route === 'dashboard-pagesAccess') {
      buildRoutes.push(<Route key="pagesAccess" path="pagesAccess" element={<PagesAccess />} />)
    }
  }

  if (userAccess) {
    userAccess.map((access) => {
      handleAddRoute(access.data.userAccessPageShortName)
      return null
    })
  }

  if (userTypeAccess) {
    userTypeAccess.map((access) => {
      handleAddRoute(access.data.userAccessPageShortName)
      return null
    })
  }

  return (
    <Page>
      <Header />
      <Routes>
        <Route
          index
          element={<Main userId={userId} userAccess={userAccess} userTypeAccess={userTypeAccess} />}
        />
        {buildRoutes}
      </Routes>
    </Page>
  )
}

export default Dashboard
