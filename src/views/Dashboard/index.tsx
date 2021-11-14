import React, { useState } from 'react'
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

  if(userId === '0x0') {
    return <NotFound />
  }
  if (!userAccessLoaded) {
    usersApi.readUserAccessByUserId(userId).then((res) => {
      setUserAccess(res)
      setUserAccessLoaded(true)
      }).catch(err => {
      console.error(err)
    })
    if (!userTypeAccessLoaded) {
      usersApi.readUserByUserId(userId).then(res => {
        usersApi.readUserAccessByUserTypeCode(res[0].data.userType).then((response) => {
          setUserTypeAccess(response)
          setUserTypeAccessLoaded(true)
        }).catch(err => {
          console.error(err)
        })
      }).catch(err => {
        console.error(err)
      })
    }
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
