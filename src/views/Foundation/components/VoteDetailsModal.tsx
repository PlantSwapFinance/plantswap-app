import React from 'react'
import { Box, Flex, InjectedModalProps, Modal, Spinner } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number
}

const VoteDetailsModal: React.FC<VoteDetailsModalProps> = ({ block }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Modal title={t('Voting Power')} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="24px" width="320px"> {block}
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
