import React, { useState, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardHeader, Flex, Heading, Text, Button, OpenNewIcon, useModal, Modal } from '@plantswap/uikit'
import { nanoid } from 'nanoid'
import { useTranslation } from 'contexts/Localization'
import emailjs from 'emailjs-com'
import usersApi from 'utils/calls/users'
import UsernameList from './components/users/UsernameList'
import MenuUser from './components/users/MenuUser'
import AddEditForm, { IUserState, getFormErrors } from './components/users/AddEditUsernameForm'
import { ModalProps } from './components/types'

const UsersList: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const showCreateModal = location.pathname.includes('create')
  const [usernameListLoaded, setUsernameListLoaded] = useState(false)

  const [state, setState] = useState<IUserState>({
    userId: '',
    username: '',
  })
  // eslint-disable-next-line
  const { userId, username } = state
  // eslint-disable-next-line
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
      const newUsern: IUserState = {
        userId: nanoid(),
        username
      }
      usersApi.createUsers(newUsern).then(() => setUsernameListLoaded(false) ).catch((err) => {
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
    <CreateModal title={t('Reserve/Block a username')} />,
    true,
    true,
    "reactiveModalCreate"
  )

  return (
    <>
      <MenuUser activeIndex={3} />
      <Card mb="32px">
        {showCreateModal ? (
          <>
            <CardHeader>
              <Heading as="h3" fontSize="20px" mb="8px">{t('Reserve/Block a username')}</Heading>
            </CardHeader>
            <CardBody>
              <AddEditForm 
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                fieldsState={fieldsState}
                formErrors={formErrors}
                onDismiss={null}
                />
            </CardBody>
          </>
        ) : (
          <>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading scale="lg" mb="8px">
                    {t('Username List')}
                  </Heading>
                  <Text as="p">{t('The list of all Esports Central usernames used by active profile, username blocked, reserved or retired.')}</Text>
                </div>
                <Button variant="subtle" p={2} m={2} mr={10} startIcon={<OpenNewIcon width="18px" color="primary" mr="4px" />} onClick={onPresentAddUserModal}>
                  {t('Reserve/Block a username')}
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <UsernameList usernameListLoaded={usernameListLoaded} setUsernameListLoaded={setUsernameListLoaded} />
            </CardBody>
          </>
        )}
      </Card>
    </>
  )
}

export default UsersList