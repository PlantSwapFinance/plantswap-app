import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, PencilIcon, RemoveIcon, Button, Text, Modal, useModal } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import usersApi from 'utils/calls/users'
import AddEditForm, { IUserTypeState, getFormErrors } from './AddEditTypeForm'

interface UserTypeCardProps {
  user: any
  userTypeId: string
  setUserTypeLoaded: (boolean) => void
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
  justify-content: left;
  width: 40%;
  padding-left: 8px;
`

const Row = styled(Flex)`
  flex-direction: row;
  width: 100%;
  min-width: 100%;
  padding-bottom: 8px;
`

const Divider = styled.hr`
  margin: 0;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  width: 100%;
`

const Info = styled(Flex)`
  width: 70%;
  padding-right: 8px;
  padding-left: 8px;
`

const Action = styled(Flex)`
  justify-content: right;
  align-items: right;
  width: 30%;
  padding-right: 8px;
  align-self: flex-end;
`

const UserTypeCard: React.FC<UserTypeCardProps> = ({ user, userTypeId, setUserTypeLoaded }) => {
  const { t } = useTranslation()
  const [userIdSelected, setUserIdSelected] = useState('')

  const handleDelete = (value) => {
    usersApi.deleteUsersType(value)
    setUserTypeLoaded(false)
  }

  const UpdateModal: React.FC<ModalProps> = ({ title, onDismiss }) => {
    const [userFound, setUserFound] = useState(false)
    const [userRef, setUserRef] = useState('')
    const [state, setState] = useState<IUserTypeState>({
      userTypeId: '',
      userTypeName: '',
      userTypeCode: '',
      userTypeInternalDescription: '',
      userTypePublicDescription: '',
    })
    if (!userFound) {
      usersApi.readUsersTypesByUsersTypeId(userIdSelected).then((foundUser) => {
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
    const { userTypeId, userTypeName, userTypeCode, userTypeInternalDescription, userTypePublicDescription } = state
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
      if(userTypeName) {
        const editedUser: IUserTypeState = {
          userTypeId,
          userTypeName,
          userTypeCode,
          userTypeInternalDescription,
          userTypePublicDescription
        }
        usersApi.updateUsersType(userRef, editedUser).then(() => {
          setUserTypeLoaded(false)
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
              value={{ userTypeId, userTypeName, userTypeCode, userTypeInternalDescription, userTypePublicDescription }}
              handleSubmit={handleSubmit} 
              handleChange={handleChange} 
              fieldsState={fieldsState}
              formErrors={formErrors}
              onDismiss={onDismiss}
              locationAfterSubmit="dashboard/usersType"
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
    <>
      <Row>
        <Info>
          <Details>
            <Text as="p" color="textSubtle" fontSize="20px" bold>{user.data.userTypeName}</Text>
          </Details>
          <Flex alignItems="left" p={2}>
            <PencilIcon width="18px" color="textSubtle" mr="4px" />
            <Text color="textSubtle" fontSize="14px">
              #{user.data.userTypeCode}
            </Text>
          </Flex>
          <Flex alignItems="left">
            <Text as="p" color="textSubtle" fontSize="14px">
              {t('Internal')}: {user.data.userTypeInternalDescription}
              <Divider />
              {t('Public')}: {user.data.userTypePublicDescription}
            </Text>
          </Flex>
        </Info>
        <Action>
          <Button variant="secondary" p={2} mr={2} startIcon={<PencilIcon width="18px" color="textSubtle" mr="4px" />} onClick={() => {
              onUpdateUser()
              setUserIdSelected(userTypeId)
            }}>
            {t('Edit')}
          </Button>
          <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => {
              onDeleteUser()
              setUserIdSelected(userTypeId)
            }}>
            <Text color="failure">{t('Delete')}</Text>
          </Button>
        </Action>
      </Row>
    </>
  )
}

export default UserTypeCard
