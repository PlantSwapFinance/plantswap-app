import React, { ChangeEvent, useState } from 'react'
import { ContextApi } from 'contexts/Localization/types'
import styled from 'styled-components'
import { Modal, Text, Button, AutoRenewIcon, ModalBody, Box, Input, Radio } from '@plantswap/uikit'
import { MASTERGARDENERDEVADDRESS } from 'config'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useAddFarms from '../hooks/useAddFarms'

interface AddFarmsModalProps {
  account: string
  onDismiss?: () => void
}

export interface FormState {
  lpTokenAddress: string
  allocPoint: number
  depositFee: number
  withUpdate: boolean
}

const BaseLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`

const Label = styled(BaseLabel)`
  font-size: 20px;
`

const FormError: React.FC = ({ children }) => (
  <Text color="failure" mb="4px">
    {children}
  </Text>
)

const FormErrors: React.FC<{ errors: string[] }> = ({ errors }) => {
  return (
    <Box mt="8px">
      {errors.map((error) => {
        return <FormError key={error}>{error}</FormError>
      })}
    </Box>
  )
}

const getFormErrors = (formData: FormState, t: ContextApi['t']) => {
  const { lpTokenAddress, allocPoint, depositFee, withUpdate } = formData
  const errors: { [key: string]: string[] } = {}

  if (!lpTokenAddress) {
    errors.lpTokenAddress = [t('%field% is required', { field: 'LP Token Address' })]
  }

  if (!allocPoint) {
    errors.allocPoint = [t('%field% is required', { field: 'Allocation points' })]
  }

  if (!depositFee) {
    errors.depositFee = [t('%field% is required', { field: 'Deposit fee' })]
  }

  if (!withUpdate) {
    errors.withUpdate = [t('%field% is required', { field: 'With update' })]
  }

  return errors
}

const AddFarmsModal: React.FC<AddFarmsModalProps> = ({
  account,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const [state, setState] = useState<FormState>({
    lpTokenAddress: '',
    allocPoint: 0,
    depositFee: 0,
    withUpdate: false,
  })
  const { lpTokenAddress, allocPoint, depositFee, withUpdate } = state
  const formErrors = getFormErrors(state, t)
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const { onAddFarms } = useAddFarms(lpTokenAddress, allocPoint, depositFee, withUpdate)

  const handleCreate = async () => {
    setIsCreating(false)
    try {
      await onAddFarms()
      toastSuccess(t('Farm Created'), t('The farm has been created!'))
      setIsCreated(true)
      onDismiss()
    } catch (e) {
      setIsCreated(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  const updateValue = (key: string, value: string | number | boolean) => {
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

  return (
    <Modal
      title={t('Create a new Farm')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.newTrees}
    >
      <ModalBody>
        {account === MASTERGARDENERDEVADDRESS && (
          <>
            <Box mb="24px">
              <Label htmlFor="lpTokenAddress">{t('LP Token Address')}</Label>
              <Input id="lpTokenAddress" name="lpTokenAddress" value={lpTokenAddress} scale="lg" onChange={handleChange} required />
              { formErrors.lpTokenAddress && fieldsState.lpTokenAddress && <FormErrors errors={formErrors.lpTokenAddress} /> }
            </Box>

            <Box>
              <Label htmlFor="allocPoint">{t('Allocation points')}</Label>
              <Input id="allocPoint" name="allocPoint" value={allocPoint} scale="lg" onChange={handleChange} required />
              { formErrors.allocPoint && fieldsState.allocPoint && <FormErrors errors={formErrors.allocPoint} /> }
            </Box>

            <Box>
              <Label htmlFor="depositFee">{t('Token variant Id End')}</Label>
              <Text as="p" color="textSubtle" >
                {t('(Leave blank for 0%, base 1000, 1% = 10')}
              </Text>
              <Input id="depositFee" name="depositFee" value={depositFee} scale="lg" onChange={handleChange} required />
              { formErrors.depositFee && fieldsState.depositFee && <FormErrors errors={formErrors.depositFee} /> }
            </Box>

            <Box mb="24px">
              <Label htmlFor="rewardExtraToken">{t('Withupdate')}</Label>
              <Radio name="withUpdate" checked={withUpdate} onChange={handleChange} style={{ flex: 'none' }} />
              { formErrors.withUpdate && fieldsState.withUpdate && <FormErrors errors={formErrors.withUpdate} /> }
            </Box>

            <Box>
              <>
                <Button
                  isLoading={isCreating}
                  disabled={isCreated || isCreating || pendingTx}
                  onClick={handleCreate}
                  endIcon={isCreating ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                  id="createByAdmin"
                >
                  {t('Create a farm')}
                </Button>
              </>
            </Box>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default AddFarmsModal
