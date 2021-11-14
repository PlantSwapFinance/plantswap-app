import React, { useState } from 'react'
import styled from 'styled-components'
import usersApi from 'utils/calls/users'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UserAccessCard from './UserAccessCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const UserAccess = ({ userAccessLoaded, setUserAccessLoaded }) => {
  const { t } = useTranslation()

  const [userAccess, setUserAccess] = useState([])

  if(!userAccessLoaded) {
    usersApi.readAllUsersAccess().then((users) => {
      setUserAccess(users)
      setUserAccessLoaded(true)
    })
  }

  return (
    <>
      <Grid>
        {userAccess.length > 0 && userAccess.map((user) => (
          <>
          <UserAccessCard 
            key={user.userAccessId} 
            user={user} 
            userAccessId={user.data.userAccessId} 
            setUserAccessLoaded={setUserAccessLoaded}
          />
          </>
        ))}
      </Grid>
      {userAccess.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No user access yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default UserAccess
