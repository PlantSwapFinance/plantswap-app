export interface ModalProps {
    title: string
    hideCloseButton?: boolean
    onDismiss?: () => void
    handleChange?: any
    handleChangeEvent?: any
    onBack?: () => void
    bodyPadding?: string
    headerBackground?: string
    minWidth?: string
  }