import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, PencilIcon, RemoveIcon, Button, Text, Modal, useModal } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import usersApi from 'utils/calls/users'
import AddEditForm, { IUserState, getFormErrors } from './AddEditForm'

interface UserCardProps {
  user: any
  userId: string
  setUserListLoaded: (boolean) => void
}

interface ModalProps {
  title: string
  hideCloseButton?: boolean
  onDismiss?: () => void
  onBack?: () => void
  bodyPadding?: string
  headerBackground?: string
  minWidth?: string
}

const Details = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
`

const Divider = styled.hr`
  margin: 0;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  width: 100%;
`

const UserCard: React.FC<UserCardProps> = ({ user, userId, setUserListLoaded }) => {
  const { t } = useTranslation()
  const [userIdSelected, setUserIdSelected] = useState('')

  const handleDelete = (value) => {
    usersApi.deleteUsers(value)
    setUserListLoaded(false)
  }

  const UpdateModal: React.FC<ModalProps> = ({ title, onDismiss }) => {
    const [userFound, setUserFound] = useState(false)
    const [userRef, setUserRef] = useState('')
    const [state, setState] = useState<IUserState>({
      userId: '',
      username: '',
      userType: '',
      email: '',
      telephone: '',
    })
    if (!userFound) {
      usersApi.readUserByUserId(userIdSelected).then((foundUser) => {
        if (foundUser[0].data) {
          setState(foundUser[0].data)
          setUserRef(foundUser[0].ref["@ref"].id)
        }
        setUserFound(true)
      }).catch((err) => {
        console.error(err)
        setUserFound(true)
      })
    }
    // eslint-disable-next-line
    const { userId, username, userType, email, telephone } = state
    const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
    const formErrors = getFormErrors(state, t)

    const updateValue = (key: string, value: string | number | Date) => {
      setState((prevState) => ({
        ...prevState,
        [key]: value,
      }))
  
      // Keep track of what fields the user has attempted to edit
      setFieldsState((prevFieldsState) => ({
        ...prevFieldsState,
        [key]: true,
      }))
    }
    
    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
      const { name: inputName, value } = evt.currentTarget
      updateValue(inputName, value)
    }

    const handleSubmit = (e: any) => {
      e.preventDefault()
      if(username) {
        const editedUser: IUserState = {
          userId,
          username,
          userType,
          email,
          telephone
        }
        usersApi.updateUsers(userRef, editedUser).then(() => {
          setUserListLoaded(false)
          setUserIdSelected('')
          onDismiss()
        }).catch((err) => {
          console.error(err)
        })
        setUserFound(false)
      }
    }

    return (
      <Modal title={title} onDismiss={onDismiss}>
        <Flex flexDirection="column" alignItems="center">
          
          <AddEditForm 
              value={{ userId, username, userType, email, telephone }}
              handleSubmit={handleSubmit} 
              handleChange={handleChange} 
              fieldsState={fieldsState}
              formErrors={formErrors}
              onDismiss={onDismiss}
            />
        </Flex>
      </Modal>
    )
  }

  const DeleteModal: React.FC<ModalProps> = ({ title, onDismiss }) => {

    return (
      <Modal title={title} onDismiss={onDismiss}>
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="20px" fontWeight="bold">
            {t('Confirm the deletion of the user')}
          </Text>
          <br />
          <br />
          <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => {
            handleDelete(user.ref["@ref"].id)
              onDismiss()
            }}>
            <Text color="failure">{t('Edit')}</Text>
          </Button>
        </Flex>
      </Modal>
    )
  }

  const [onUpdateUser] = useModal(
    <UpdateModal title={t('Update a user')} />,
    true,
    true,
    "reactiveModalUpdate"
  )

  const [onDeleteUser] = useModal(
    <DeleteModal title={t('Confirm deletion')} />,
    true,
    true,
    "reactiveModalDelete"
  )

  return (
    <Flex>
      <Details>
        <Text as="p" color="textSubtle" fontSize="18px" bold>{user.data.username}</Text>
        <Text as="p" color="textSubtle" fontSize="18px">{user.data.email}</Text>
      </Details>
      <Flex alignItems="center">
        <PencilIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle" fontSize="12px">
          id: {user.data.userId}
        </Text>
        <Divider />
        <Text color="textSubtle" fontSize="14px">
          #{user.data.userType}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Button variant="secondary" p={2} mr={2} startIcon={<PencilIcon width="18px" color="textSubtle" mr="4px" />} onClick={() => {
            onUpdateUser()
            setUserIdSelected(userId)
          }}>
          {t('Edit')}
        </Button>
        <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => {
            onDeleteUser()
            setUserIdSelected(userId)
          }}>
          <Text color="failure">{t('Delete')}</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

export default UserCard
