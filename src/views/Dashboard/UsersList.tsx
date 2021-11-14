import React, { useState, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardHeader, Flex, Heading, Text, Button, OpenNewIcon, useModal, Modal } from '@plantswap/uikit'
import { nanoid } from 'nanoid'
import { useTranslation } from 'contexts/Localization'
import bcrypt from 'bcryptjs'
import emailjs from 'emailjs-com'
import usersApi from 'utils/calls/users'
import UserList from './components/users/UserList'
import MenuUser from './components/users/MenuUser'
import AddEditForm, { IUserState, getFormErrors } from './components/users/AddEditForm'
import { ModalProps } from './components/types'

const UsersList: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const showCreateModal = location.pathname.includes('create')
  const [userListLoaded, setUserListLoaded] = useState(false)

  const [state, setState] = useState<IUserState>({
    userId: '',
    username: '',
    userType: '',
    password: '',
    email: '',
    telephone: ''
  })
  // eslint-disable-next-line
  const { userId, username, userType, password, email, telephone } = state
  // eslint-disable-next-line
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const formErrors = getFormErrors(state, t)
  
  const handleHash = (toHash: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(toHash, salt);
    return hash
  }

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
      const newUsern: IUserState = {
        userId: nanoid(),
        username,
        userType,
        password: handleHash(password),
        email,
        telephone
      }
      usersApi.createUsers(newUsern).then(() => setUserListLoaded(false) ).catch((err) => {
        console.error(err)
      })
      emailjs
        .sendForm(
          'gmail_marc_esportscentra', 'template_basic', e.target, 'user_JLozWFTpRTLvTUI0DUZAC'
        )
    }
  }
  
  const CreateModal: React.FC<ModalProps> = ({ title, onDismiss }) => {
    return (
      <Modal title={title} onDismiss={onDismiss}>
        <Flex flexDirection="column" alignItems="center">
          <AddEditForm 
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

  const [onPresentAddUserModal] = useModal(
    <CreateModal title={t('Create User/Create a invitation')} />,
    true,
    true,
    "reactiveModalCreate"
  )

  return (
    <>
      <MenuUser />
      <Card mb="32px">
        {showCreateModal ? (
          <>
            <CardHeader>
              <Heading as="h3" fontSize="20px" mb="8px">{t('Create User/Create a invitation')}</Heading>
            </CardHeader>
            <CardBody>
              <AddEditForm 
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                fieldsState={fieldsState}
                formErrors={formErrors}
                onDismiss={null}
                locationAfterSubmit={null}
                />
            </CardBody>
          </>
        ) : (
          <>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading scale="lg" mb="8px">
                    {t('User List')}
                  </Heading>
                  <Text as="p">{t('The list of all Esports Central users')}</Text>
                </div>
                <Button variant="subtle" p={2} m={2} mr={10} startIcon={<OpenNewIcon width="18px" color="primary" mr="4px" />} onClick={onPresentAddUserModal}>
                  {t('Create User/Create a invitation')}
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <UserList userListLoaded={userListLoaded} setUserListLoaded={setUserListLoaded} />
            </CardBody>
          </>
        )}
      </Card>
    </>
  )
}

export default UsersList