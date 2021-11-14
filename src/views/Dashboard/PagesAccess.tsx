import React, { useState, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, CardHeader, Flex, Heading, Text, Button, OpenNewIcon, useModal, Modal } from '@plantswap/uikit'
import { nanoid } from 'nanoid'
import { useTranslation } from 'contexts/Localization'
import pagesApi from 'utils/calls/pages'
import PageAccess from './components/pages/PageAccess'
import MenuPageList from './components/pages/MenuPageList'
import AddEditForm, { IPageState, getFormErrors } from './components/pages/AddEditForm'
import { ModalProps } from './components/types'

const PagesAccess: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const showCreateModal = location.pathname.includes('create')
  const [pageAccessLoaded, setPageAccessLoaded] = useState(false)

  const [state, setState] = useState<IPageState>({
    pageId: '',
    pageName: '',
    pageShortName: '',
    pageDescription: ''
  })
  // eslint-disable-next-line
  const { pageId, pageName, pageShortName, pageDescription } = state
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
    if(pageName) {
      const newPagen: IPageState = {
        pageId: nanoid(),
        pageName,
        pageShortName,
        pageDescription
      }
      pagesApi.createPagesAccess(newPagen).then(() => setPageAccessLoaded(false) ).catch((err) => {
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

  const [onPresentAddPageModal] = useModal(
    <CreateModal title={t('Create a Page Access')} />,
    true,
    true,
    "reactiveModalCreate"
  )

  return (
    <>
      <MenuPageList activeIndex={1} />
      <Card mb="32px">
        {showCreateModal ? (
          <>
            <CardHeader>
              <Heading as="h3" fontSize="20px" mb="8px">{t('Create a Page Access')}</Heading>
            </CardHeader>
            <CardBody>
              <AddEditForm 
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                fieldsState={fieldsState}
                formErrors={formErrors}
                onDismiss={null}
                locationAfterSubmit="dashboard/usersAccess"
                />
            </CardBody>
          </>
        ) : (
          <>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading scale="lg" mb="8px">
                    {t('Page Access')}
                  </Heading>
                  <Text as="p">{t('The list of all Esports Central pages')}</Text>
                </div>
                <Button variant="subtle" p={2} m={2} mr={10} startIcon={<OpenNewIcon width="18px" color="primary" mr="4px" />} onClick={onPresentAddPageModal}>
                  {t('Create s Page Access')}
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <PageAccess pageAccessLoaded={pageAccessLoaded} setPageAccessLoaded={setPageAccessLoaded} />
            </CardBody>
          </>
        )}
      </Card>
    </>
  )
}

export default PagesAccess