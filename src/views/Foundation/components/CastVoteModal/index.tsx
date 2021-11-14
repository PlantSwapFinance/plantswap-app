import React, { useState } from 'react'
import { Box, Modal } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { CastVoteModalProps, ConfirmVoteView } from './types'

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const { t } = useTranslation()
  const { theme } = useTheme()

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Box mb="24px" width="320px">
        <>
        </>
      </Box>
    </Modal>
  )
}

export default CastVoteModal
