import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
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
      buildRoutes.push(<Route path="/dashboard/users" component={UsersList} />) 
    }
    if (route === 'dashboard-usersAccess') {
      buildRoutes.push(<Route path="/dashboard/usersAccess" component={UsersAccess} />) 
    }
    if (route === 'dashboard-usersType') {
      buildRoutes.push(<Route path="/dashboard/usersType" component={UsersType} />) 
    }
    if (route === 'dashboard-usernames') {
      buildRoutes.push(<Route path="/dashboard/usernames" component={UsernamesList} />) 
    }
    /* Pages */
    if (route === 'dashboard-pages') {
      buildRoutes.push(<Route path="/dashboard/pages" component={PagesList} />) 
    }
    if (route === 'dashboard-pagesAccess') {
      buildRoutes.push(<Route path="/dashboard/pagesAccess" component={PagesAccess} />) 
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
      <Route exact path="/dashboard">
        <Main 
          userId={userId}
          userAccess={userAccess}
          userTypeAccess={userTypeAccess}
        />
      </Route>
      {buildRoutes.length > 0 && buildRoutes.map((route) => {
        return route
      })}
    </Page>
  )
}

export default Dashboard
