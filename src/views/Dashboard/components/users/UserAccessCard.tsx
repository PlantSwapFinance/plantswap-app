import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, LogoIcon, OpenNewIcon, PencilIcon, RemoveIcon, Button, Text, Modal, useModal } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import usersApi from 'utils/calls/users'
import AddEditForm, { IUserAccessState, getFormErrors } from './AddEditAccessForm'

interface UserAccessCardProps {
  user: any
  userAccessId: string
  setUserAccessLoaded: (boolean) => void
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

const UserAccessCard: React.FC<UserAccessCardProps> = ({ user, userAccessId, setUserAccessLoaded }) => {
  const { t } = useTranslation()
  const [userIdSelected, setUserIdSelected] = useState('')

  const handleDelete = (value) => {
    usersApi.deleteUsersAccess(value)
    setUserAccessLoaded(false)
  }

  const UpdateModal: React.FC<ModalProps> = ({ title, onDismiss }) => {
    const [userFound, setUserFound] = useState(false)
    const [userRef, setUserRef] = useState('')
    const [state, setState] = useState<IUserAccessState>({
      userAccessId: '',
      userAccessType: '',
      userId: '',
      userTypeCode: '',
      userAccessPageShortName: '',
      userAccessPagesActionId: ''
    })
    if (!userFound) {
      usersApi.readUserAccessByUserId(userIdSelected).then((foundUser) => {
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
    const { userAccessId, userAccessType, userId, userTypeCode, userAccessPageShortName, userAccessPagesActionId } = state
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
      if(userAccessType) {
        const editedUser: IUserAccessState = {
          userAccessId,
          userAccessType,
          userId,
          userTypeCode,
          userAccessPageShortName,
          userAccessPagesActionId
        }
        usersApi.updateUsersAccess(userRef, editedUser).then(() => {
          setUserAccessLoaded(false)
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
              value={{ 
                userAccessId, 
                userAccessType, 
                userId, 
                userTypeCode, 
                userAccessPageShortName,
                userAccessPagesActionId,
               }}
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
        <Text as="p" color="textSubtle" fontSize="20px">
          {user.data.userAccessType === "userId" ? (
            <>
              <LogoIcon width="18px" color="textSubtle" mr="4px" />
              {user.data.userId}
            </>
          ) : (
            <>
              <PencilIcon width="18px" color="textSubtle" mr="4px" />
              {user.data.userTypeCode}
            </>
          )}</Text>
          <Text as="p" color="textSubtle" fontSize="16px" ml="2vw" bold>{user.data.userAccessType}</Text>
      </Details>
      <Flex alignItems="center" p={2}>
        <OpenNewIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle" fontSize="14px">
        {user.data.userAccessPageShortName}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Button variant="secondary" p={2} mr={2} startIcon={<PencilIcon width="18px" color="textSubtle" mr="4px" />} onClick={() => {
            onUpdateUser()
            setUserIdSelected(userAccessId)
          }}>
          {t('Edit')}
        </Button>
        <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => {
            onDeleteUser()
            setUserIdSelected(userAccessId)
          }}>
          <Text color="failure">{t('Delete')}</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

export default UserAccessCard
