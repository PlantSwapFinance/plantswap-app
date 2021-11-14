import React, { useState, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardHeader, Flex, Heading, Text, Button, OpenNewIcon, useModal, Modal } from '@plantswap/uikit'
import { nanoid } from 'nanoid'
import { useTranslation } from 'contexts/Localization'
import usersApi from 'utils/calls/users'
import UserType from './components/users/UserType'
import MenuUser from './components/users/MenuUser'
import AddEditForm, { IUserTypeState, getFormErrors } from './components/users/AddEditTypeForm'
import { ModalProps } from './components/types'

const UsersType: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const showCreateModal = location.pathname.includes('create')
  const [userTypeLoaded, setUserTypeLoaded] = useState(false)

  const [state, setState] = useState<IUserTypeState>({
    userTypeId: '',
    userTypeName: '',
    userTypeCode: '',
    userTypeInternalDescription: '',
    userTypePublicDescription: ''
  })
  // eslint-disable-next-line
  const { userTypeId, userTypeName, userTypeCode, userTypeInternalDescription, userTypePublicDescription } = state
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
    if(userTypeName && userTypeCode) {
      const newUsern: IUserTypeState = {
        userTypeId: nanoid(),
        userTypeName,
        userTypeCode,
        userTypeInternalDescription,
        userTypePublicDescription
      }
      usersApi.createUsersType(newUsern).then(() => setUserTypeLoaded(false) ).catch((err) => {
        console.error(err)
      })

    }
  }
  
  const CreateModal: React.FC<ModalProps> = ({ title, onDismiss, handleChangeEvent }) => {
    return (
      <Modal title={title} onDismiss={onDismiss}>
        <Flex flexDirection="column" alignItems="center">
          <AddEditForm 
            handleSubmit={handleSubmit} 
            fieldsState={fieldsState}
            formErrors={formErrors}
            onDismiss={onDismiss}
            handleChange={handleChangeEvent} 
          />
        </Flex>
      </Modal>
    )
  }

  const [onPresentAddUserModal] = useModal(
    <CreateModal title={t('Create User Type')} />,
    true,
    true,
    "reactiveModalCreate"
  )

  return (
    <>
      <MenuUser activeIndex={2} />
      <Card mb="32px">
        {showCreateModal ? (
          <>
            <CardHeader>
              <Heading as="h3" fontSize="20px" mb="8px">{t('Create User Type')}</Heading>
            </CardHeader>
            <CardBody>
              <AddEditForm 
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                fieldsState={fieldsState}
                formErrors={formErrors}
                onDismiss={null}
                locationAfterSubmit="dashboard/users"
                />
            </CardBody>
          </>
        ) : (
          <>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading scale="lg" mb="8px">
                    {t('User Type')}
                  </Heading>
                  <Text as="p">{t('The list of all Esports Central users')}</Text>
                </div>
                <Button variant="subtle" p={2} m={2} mr={10} startIcon={<OpenNewIcon width="18px" color="primary" mr="4px" />} onClick={onPresentAddUserModal}>
                  {t('Create User Type')}
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <UserType userTypeLoaded={userTypeLoaded} setUserTypeLoaded={setUserTypeLoaded} />
            </CardBody>
          </>
        )}
      </Card>
    </>
  )
}

export default UsersType