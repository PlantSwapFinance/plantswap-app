import React from 'react'
import styled from 'styled-components'
import { Flex, RemoveIcon, Button, Text, Modal, useModal } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import usernamesApi from 'utils/calls/usernames'

interface UsernameCardProps {
  user: any
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

const UsernameCard: React.FC<UsernameCardProps> = ({ user, setUserListLoaded }) => {
  const { t } = useTranslation()

  const handleDelete = (value) => {
    usernamesApi.deleteUsernames(value)
    setUserListLoaded(false)
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

  const [onDeleteUser] = useModal(
    <DeleteModal title={t('Confirm deletion')} />,
    true,
    true,
    "reactiveModalDelete"
  )

  return (
    <Flex>
      <Details>
        <Text as="p" color="textSubtle" fontSize="18px" bold>
          <RemoveIcon width="18px" color="textSubtle" mr="4px" />
          {user.data.username}
        </Text>
      </Details>
      <Flex alignItems="center" p={2}>
        <Text as="p" color="textSubtle" fontSize="14px">{user.data.email}</Text>
      </Flex>
      <Flex alignItems="center">
        <Button variant="secondary" p={2} m={0} startIcon={<RemoveIcon width="18px" color="failure" mr="4px" />} onClick={() => onDeleteUser()}>
          <Text color="failure">{t('Delete')}</Text>
        </Button>
      </Flex>
    </Flex>
  )
}

export default UsernameCard
