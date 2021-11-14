import React, { ChangeEvent, useState } from 'react'
import { ContextApi } from 'contexts/Localization/types'
import styled from 'styled-components'
import { Modal, Text, Button, AutoRenewIcon, Link, ModalBody, Box, Input, Radio, Flex, PencilConfigIcon } from '@plantswap/uikit'
import { MASTERGARDENERDEVADDRESS } from 'config'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useAddByAdminCollectiblesFarms from '../../../hooks/useAddByAdminCollectiblesFarms'
import useAddByUserCollectiblesFarms from '../../../hooks/useAddByUserCollectiblesFarms'

interface AddCollectiblesFarmsModalProps {
  account: string
  onDismiss?: () => void
}

export interface FormState {
  nftAddress: string
  variantIdStart: number
  variantIdEnd: number
  isUserRestricted: boolean
  rewardExtraToken: string
  rewardExtraCut: number
  pid: number
}


const StyledLink = styled(Link)`
  width: 100%;
`

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
  const { nftAddress, variantIdStart, variantIdEnd, isUserRestricted, pid } = formData
  const errors: { [key: string]: string[] } = {}

  if (!nftAddress) {
    errors.nftAddress = [t('%field% is required', { field: 'Nft Contract Address' })]
  }

  if (!variantIdStart) {
    errors.variantIdStart = [t('%field% is required', { field: 'Token Variant Id Start' })]
  }

  if (!variantIdEnd) {
    errors.variantIdEnd = [t('%field% is required', { field: 'Token Variant Id End' })]
  }

  if (!isUserRestricted) {
    errors.isUserRestricted = [t('%field% is required', { field: 'Profile require' })]
  }

  if (!pid) {
    errors.pid = [t('%field% is required', { field: 'Master Gardener Pid' })]
  }

  return errors
}

const AddCollectiblesFarmsModal: React.FC<AddCollectiblesFarmsModalProps> = ({
  account,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [isFarmActive, setIsFarmActive] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const [state, setState] = useState<FormState>({
    nftAddress: '',
    variantIdStart: 0,
    variantIdEnd: 0,
    isUserRestricted: false,
    rewardExtraToken: '',
    rewardExtraCut: 150,
    pid: 0,
  })
  const { nftAddress, variantIdStart, variantIdEnd, isUserRestricted, rewardExtraToken, rewardExtraCut, pid } = state
  const formErrors = getFormErrors(state, t)
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const { onAddByAdmin } = useAddByAdminCollectiblesFarms(nftAddress, rewardExtraToken, rewardExtraCut, variantIdStart, variantIdEnd, isUserRestricted)
  const { onAddByUser } = useAddByUserCollectiblesFarms(nftAddress, rewardExtraToken, variantIdStart, variantIdEnd, isUserRestricted)

  const handleCreateByAdmin = async () => {
    setIsCreating(false)
    try {
      await onAddByAdmin()
      toastSuccess(t('Collectibles Farm Created'), t('The collectibles farm has been created, you now need to initialize it!'))
      setIsCreated(true)
    } catch (e) {
      setIsCreated(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }
  const handleCreateByUser = async () => {
    setIsCreating(false)
    try {
      await onAddByUser()
      toastSuccess(t('Collectibles Farm Created'), t('The collectibles farm has been created, you now need to initialize it!'))
      setIsCreated(true)
    } catch (e) {
      setIsCreated(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  const handleInitializeByAdmin = async () => {
    setPendingTx(true)
    try {
      // initialize
      toastSuccess(`${t('Finish')}!`, t('Your collectibles farm has been initialize!'))
      setPendingTx(false)
      setIsFarmActive(true)
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }
  const handleInitializeByUser = async () => {
    setPendingTx(true)
    try {
      // initialize
      toastSuccess(`${t('Finish')}!`, t('Your collectibles farm has been initialize!'))
      setPendingTx(false)
      onDismiss()
    } catch (e) {
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
      title={t('Create a new Collectibles Farm')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.newTrees}
    >
      <ModalBody>
          <>
          <Flex alignItems="center" justifyContent="center" flexDirection={['column', null, null, 'row']}>
          <Flex>
            <PencilConfigIcon width={80} height={80} />
          </Flex>
          <Flex flex="1" width={['100%', null, 'auto']}>
            <Text>This section is in progress, the smart contract and user interface are finished, we now need to finish the connection in-between the website and the contract.
              <br />
              Follow us on social medial to stay updated!</Text>
          </Flex>
        </Flex>
            {account === MASTERGARDENERDEVADDRESS ? (
              <Text color="warning">{t('Admin Mode')}</Text>
            ) : (
              <>
                <Text color="warning">{t('Anyone can create a collectibles farms for any token from a ERC721 Nft contract address.')}</Text>
                <Text color="warning">{t('To use the variant Id, it need to be a Nft address that is configurated in our PlantswapNftAgent contract.')}</Text>
                <Text color="warning">{t('You will also need to select a reward token and give a initial amount of those token to initialize the farm.')}</Text>
                <Text color="warning">{t('This reward token (aka extraRewardToken) canot be changed and must beERC-20 compatible.')}</Text>
                <br />
                <Text color="warning">{t('Ounce your collectibles farm created and initialize, you can interact with the smart contract directly or contact us to add it to the website.')}</Text>
                <Text color="warning">{t('We will add functionallity to find and display comunity added farm in the near future.')}</Text>
              </>
            )}
            <Box mb="24px">
              <Label htmlFor="nftAddress">{t('Nft Contract Address')}</Label>
              <Input id="nftAddress" name="nftAddress" value={nftAddress} scale="lg" onChange={handleChange} required />
              { formErrors.nftAddress && fieldsState.nftAddress && <FormErrors errors={formErrors.nftAddress} /> }
            </Box>

            <Box>
              <Label htmlFor="variantIdStart">{t('Token variant Id Start')}</Label>
              <Input id="variantIdStart" name="variantIdStart" value={variantIdStart} scale="lg" onChange={handleChange} required />
              { formErrors.variantIdStart && fieldsState.variantIdStart && <FormErrors errors={formErrors.variantIdStart} /> }
            </Box>
            <Box>
              <Label htmlFor="variantIdEnd">{t('Token variant Id End')}</Label>
              <Text as="p" color="textSubtle" >
                {t('(Leave blank to allow any token from that address')}
              </Text>
              <Input id="variantIdEnd" name="variantIdEnd" value={variantIdEnd} scale="lg" onChange={handleChange} required />
              { formErrors.variantIdEnd && fieldsState.variantIdEnd && <FormErrors errors={formErrors.variantIdEnd} /> }
            </Box>

            <Box mb="24px">
              <Label htmlFor="rewardExtraToken">{t('Reward Token')}</Label>
            {account === MASTERGARDENERDEVADDRESS && (
              <Text as="p" color="textSubtle" >
                {t('(If their is a other reward than PLANT token. Can be left blank as Admin')}
              </Text>
            )}
              <Input id="rewardExtraToken" name="rewardExtraToken" value={rewardExtraToken} scale="lg" onChange={handleChange} required />
              { formErrors.rewardExtraToken && fieldsState.rewardExtraToken && <FormErrors errors={formErrors.rewardExtraToken} /> }
            </Box>

            <Box>
              <Label htmlFor="variantIdStart">{t('Restrict this collectibles farm to user with active profile')}</Label>
              <Radio name="isUserRestricted" checked={false} onChange={handleChange} style={{ flex: 'none' }} />
              { formErrors.variantIdStart && fieldsState.variantIdStart && <FormErrors errors={formErrors.variantIdStart} /> }
            </Box>

            {account === MASTERGARDENERDEVADDRESS && (
              <Box>
                <Label htmlFor="rewardExtraCut">{t('Cut on Extra Reward Token (base 1000, 15% = 150)')}</Label>
                <Input id="rewardExtraCut" name="rewardExtraCut" value={rewardExtraCut} scale="lg" onChange={handleChange} required />
                { formErrors.rewardExtraCut && fieldsState.rewardExtraCut && <FormErrors errors={formErrors.rewardExtraCut} /> }
              </Box>
            )}
            {account !== MASTERGARDENERDEVADDRESS && (
              <Text color="warning">{t('Contract creation cost: 25 PLANT')}</Text>
            )}
            {account !== MASTERGARDENERDEVADDRESS ? (
              <>
                <Button
                  isLoading={isCreating}
                  disabled={isCreated || isCreating || isFarmActive}
                  onClick={handleCreateByUser}
                  endIcon={isCreating ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                  mt="12px"
                  p="12px"
                  id="createByAdmin"
                >
                  {t('Create a collectibles farm')}
                </Button>
                <Text as="p" color="textSubtle" mb="16px">
                  {t(
                    "Ounce the farm is created you will need to provide the initial extra token reward to initialize the collectibles farm and allow deposit to start.",
                  )}
                </Text>
                <Button
                  isLoading={pendingTx}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={handleInitializeByUser}
                  disabled={!isCreated || isFarmActive}
                  mt="24px"
                  p="12px"
                >
                  {pendingTx ? t('Initializing') : t('Initialize the collectibles farm')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  isLoading={isCreating}
                  disabled={isCreated || isCreating || isFarmActive}
                  onClick={handleCreateByAdmin}
                  endIcon={isCreating ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                  mt="12px"
                  p="12px"
                  id="createByUser"
                >
                  {t('Create a collectibles farm')}
                </Button>
                <Text as="p" color="textSubtle" mb="16px">
                  {t(
                    "Ounce the farm is created you will need to add a pool in the Master Gardener contract so this farm can stake their LP and receive a PLANT reward.",
                  )}
                </Text>
                <Box mb="24px">
                  <Label htmlFor="pid">{t('Master Gardener Pid')}</Label>
                  <Input id="pid" name="pid" value={pid} scale="lg" onChange={handleChange} required />
                  { formErrors.pid && fieldsState.pid && <FormErrors errors={formErrors.pid} /> }
                </Box>
                <Button
                  isLoading={pendingTx}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={handleInitializeByAdmin}
                  disabled={!isCreated || isFarmActive || pid < 10}
                  mt="24px"
                  p="12px"
                >
                  {pendingTx ? t('Initializing') : t('Initialize the collectibles farm')}
                </Button>
              </>
            )}


              <StyledLink external href="/collectibles">
                <Button width="100%" mt="8px" variant="secondary">
                  {t('Get more collectibles')}
                </Button>
              </StyledLink>
            </>
      </ModalBody>
    </Modal>
  )
}

export default AddCollectiblesFarmsModal
