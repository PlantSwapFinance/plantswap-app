import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, PrizeIcon, PencilIcon, RemoveIcon, Button, Text, Modal, useModal } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import pagesApi from 'utils/calls/pages'
import AddEditForm, { IPageState, getFormErrors } from './AddEditForm'

interface PageAccessCardProps {
  page: any
  pageId: string
  setPageAccessLoaded: (boolean) => void
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

const PageAccessCard: React.FC<PageAccessCardProps> = ({ page, pageId, setPageAccessLoaded }) => {
  const { t } = useTranslation()
  const [pageIdSelected, setPageIdSelected] = useState('')

  const handleDelete = (value) => {
    pagesApi.deletePages(value)
    setPageAccessLoaded(false)
  }

  const UpdateModal: React.FC<ModalProps> = ({ title, onDismiss }) => {
    const [pageFound, setPageFound] = useState(false)
    const [pageRef, setPageRef] = useState('')
    const [state, setState] = useState<IPageState>({
      pageId: '',
      pageName: '',
      pageShortName: '',
      pageDescription: '',
    })
    if (!pageFound) {
      pagesApi.readPageAccessByPageId(pageIdSelected).then((foundPage) => {
        if (foundPage[0].data) {
          setState(foundPage[0].data)
          setPageRef(foundPage[0].ref["@ref"].id)
        }
        setPageFound(true)
      }).catch((err) => {
        console.error(err)
        setPageFound(true)
      })
    }
    // eslint-disable-next-line
    const { pageId, pageName, pageShortName, pageDescription } = state
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
        const editedPage: IPageState = {
          pageId,
          pageName,
          pageShortName,
          pageDescription
        }
        pagesApi.updatePagesAccess(pageRef, editedPage).then(() => {
          setPageAccessLoaded(false)
          setPageIdSelected('')
          onDismiss()
        }).catch((err) => {
          console.error(err)
        })
        setPageFound(false)
      }
    }

    return (
      <Modal title={title} onDismiss={onDismiss}>
        <Flex flexDirection="column" alignItems="center">
          
          <AddEditForm 
              value={{ pageId, pageName, pageShortName, pageDescription }}
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
            {t('Confirm the deletion of the page')}
          </Text>
          <br />
          <br />
          <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => {
            handleDelete(page.ref["@ref"].id)
              onDismiss()
            }}>
            <Text color="failure">{t('Edit')}</Text>
          </Button>
        </Flex>
      </Modal>
    )
  }

  const [onUpdatePage] = useModal(
    <UpdateModal title={t('Update a user')} />,
    true,
    true,
    "reactiveModalUpdate"
  )

  const [onDeletePage] = useModal(
    <DeleteModal title={t('Confirm deletion')} />,
    true,
    true,
    "reactiveModalDelete"
  )

  return (
    <Flex>
      <Details>
        <Text as="p" color="textSubtle" fontSize="14px">{page.data.pageName}</Text>
        <Text as="p" color="textSubtle" fontSize="14px">{page.data.pageDescription}</Text>
      </Details>
      <Flex alignItems="center" p={2}>
        <PrizeIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle" fontSize="14px">
          x points
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Button variant="secondary" p={2} mr={2} startIcon={<PencilIcon width="18px" color="textSubtle" mr="4px" />} onClick={() => {
            onUpdatePage()
            setPageIdSelected(pageId)
          }}>
          {t('Edit')}
        </Button>
        <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => {
            onDeletePage()
            setPageIdSelected(pageId)
          }}>
          <Text color="failure">{t('Delete')}</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

export default PageAccessCard
