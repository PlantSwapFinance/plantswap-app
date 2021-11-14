import React, { useState } from 'react'
import styled from 'styled-components'
import usernamesApi from 'utils/calls/usernames'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UsernameCard from './UsernameCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const UsernameList = ({ usernameListLoaded, setUsernameListLoaded }) => {
  const { t } = useTranslation()

  const [usernameList, setUsernameList] = useState([])

  if(!usernameListLoaded) {
    usernamesApi.readAllUsernames().then((users) => {
      setUsernameList(users)
      setUsernameListLoaded(true)
    })
  }

  return (
    <>
      <Grid>
        {usernameList.length > 0 && usernameList.map((user) => (
          <>
            <UsernameCard 
              key={user.userId} 
              user={user} 
              setUserListLoaded={setUsernameListLoaded}
            />
          </>
        ))}
      </Grid>
      {usernameList.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No user yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default UsernameList
