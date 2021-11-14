import React, { useState, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardHeader, Flex, Heading, Text, Button, OpenNewIcon, useModal, Modal } from '@plantswap/uikit'
import { nanoid } from 'nanoid'
import { useTranslation } from 'contexts/Localization'
import usersApi from 'utils/calls/users'
import UserAccess from './components/users/UserAccess'
import MenuUser from './components/users/MenuUser'
import AddEditForm, { IUserAccessState, getFormErrors } from './components/users/AddEditAccessForm'
import { ModalProps } from './components/types'

const UsersAccess: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const showCreateModal = location.pathname.includes('create')
  const [userAccessLoaded, setUserAccessLoaded] = useState(false)

  const [state, setState] = useState<IUserAccessState>({
    userAccessId: '',
    userAccessType: '',
    userId: '',
    userTypeCode: '',
    userAccessPageShortName: '',
    userAccessPagesActionId: ''
  })
  // eslint-disable-next-line
  const { userAccessId, userAccessType, userId, userTypeCode, userAccessPageShortName, userAccessPagesActionId } = state
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
  //  console.log('submit', state)
    if(userAccessType) {
      const newUsern: IUserAccessState = {
        userAccessId: nanoid(),
        userAccessType,
        userId,
        userTypeCode,
        userAccessPageShortName,
        userAccessPagesActionId
      }
      usersApi.createUsersAccess(newUsern).then(() => setUserAccessLoaded(false) ).catch((err) => {
        console.error(err)
      })

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
    <CreateModal title={t('Create a User Acces')} />,
    true,
    true,
    "reactiveModalCreate"
  )

  return (
    <>
      <MenuUser activeIndex={1} />
      <Card mb="32px">
        {showCreateModal ? (
          <>
            <CardHeader>
              <Heading as="h3" fontSize="20px" mb="8px">{t('Create a User Acces')}</Heading>
            </CardHeader>
            <CardBody>
              <AddEditForm 
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                fieldsState={fieldsState}
                formErrors={formErrors}
                onDismiss={null}
                locationAfterSubmit="/dashboard/usersAccess"
                />
            </CardBody>
          </>
        ) : (
          <>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading scale="lg" mb="8px">
                    {t('User Access')}
                  </Heading>
                  <Text as="p">{t('The list of all Esports Central users')}</Text>
                </div>
                <Button variant="subtle" p={2} m={2} mr={10} startIcon={<OpenNewIcon width="18px" color="primary" mr="4px" />} onClick={onPresentAddUserModal}>
                  {t('Create a User Access')}
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <UserAccess userAccessLoaded={userAccessLoaded} setUserAccessLoaded={setUserAccessLoaded} />
            </CardBody>
          </>
        )}
      </Card>
    </>
  )
}

export default UsersAccess