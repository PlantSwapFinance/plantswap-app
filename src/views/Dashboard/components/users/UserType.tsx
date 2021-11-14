import React, { useState } from 'react'
import styled from 'styled-components'
import usersApi from 'utils/calls/users'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UserTypeCard from './UserTypeCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(1, 1fr);
  }
`

const UserType = ({ userTypeLoaded, setUserTypeLoaded }) => {
  const { t } = useTranslation()

  const [userType, setUserType] = useState([])

  if(!userTypeLoaded) {
    usersApi.readAllUsersType().then((users) => {
      setUserType(users)
      setUserTypeLoaded(true)
    })
  }

  return (
    <>
      <Grid>
        {userType.length > 0 && userType.map((user) => (
          <>
          <UserTypeCard 
            key={user.userTypeId} 
            user={user} 
            userTypeId={user.data.userTypeId} 
            setUserTypeLoaded={setUserTypeLoaded}
          />
          </>
        ))}
      </Grid>
      {userType.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No user type yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default UserType
