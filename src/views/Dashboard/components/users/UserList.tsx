import React, { useState } from 'react'
import styled from 'styled-components'
import usersApi from 'utils/calls/users'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UserCard from './UserCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const UserList = ({ userListLoaded, setUserListLoaded }) => {
  const { t } = useTranslation()

  const [userList, setUserList] = useState([])

  if(!userListLoaded) {
    usersApi.readAllUsers().then((users) => {
      setUserList(users)
      setUserListLoaded(true)
    })
  }

  return (
    <>
      <Grid>
        {userList.length > 0 && userList.map((user) => (
          <>
            <UserCard 
              key={user.userId} 
              user={user} 
              userId={user.data.userId} 
              setUserListLoaded={setUserListLoaded}
            />
          </>
        ))}
      </Grid>
      {userList.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No user yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default UserList
