import React, { ChangeEvent, useMemo, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Modal, Text, Button, AutoRenewIcon, ModalBody, Box, Input, Radio, Flex } from '@plantswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { farmsConfig } from 'config/constants'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useMasterGardenerOwner from 'hooks/useMasterGardenerOwner'
import useFetchMasterGardenerPools, { MasterGardenerPool } from '../hooks/useFetchMasterGardenerPools'
import useUpdateFarm from '../hooks/useUpdateFarm'
import useAddFarms from '../hooks/useAddFarms'

interface ManageFarmsModalProps {
  tokenMode?: boolean
  onDismiss?: () => void
}

export interface AddFormState {
  lpTokenAddress: string
  allocPoint: number
  depositFee: number
  withUpdate: boolean
}

export interface EditFormState {
  allocPoint: string
  depositFeeBP: string
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

const SectionTitle = styled(Text)`
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
  margin-bottom: 12px;
`

const TableHeader = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 8px 0;
`

const TableRow = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 12px 0;
  align-items: center;
`

const CellPid = styled(Box)`
  width: 40px;
  flex-shrink: 0;
  font-family: monospace;
`

const CellLp = styled(Box)`
  flex: 1;
  min-width: 0;
  padding-right: 8px;
`

const CellNumber = styled(Box)`
  width: 90px;
  flex-shrink: 0;
  text-align: right;
`

const CellAction = styled(Box)`
  width: 130px;
  flex-shrink: 0;
  text-align: right;
`

const TotalsRow = styled(Flex)`
  padding: 8px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const FormError: React.FC = ({ children }) => (
  <Text color="failure" mb="4px">
    {children}
  </Text>
)

const FormErrors: React.FC<{ errors: string[] }> = ({ errors }) => (
  <Box mt="8px">
    {errors.map((error) => (
      <FormError key={error}>{error}</FormError>
    ))}
  </Box>
)

const truncateAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

const getAddFormErrors = (formData: AddFormState, t: ContextApi['t']) => {
  const { lpTokenAddress, allocPoint, depositFee, withUpdate } = formData
  const errors: { [key: string]: string[] } = {}

  if (!lpTokenAddress) {
    errors.lpTokenAddress = [t('%field% is required', { field: 'LP Token Address' })]
  } else if (!ethers.utils.isAddress(lpTokenAddress)) {
    errors.lpTokenAddress = [t('%field% is not a valid address', { field: 'LP Token Address' })]
  }

  if (allocPoint === null || allocPoint === undefined || Number.isNaN(allocPoint)) {
    errors.allocPoint = [t('%field% is required', { field: 'Allocation points' })]
  } else if (allocPoint < 0) {
    errors.allocPoint = [t('%field% must be >= 0', { field: 'Allocation points' })]
  }

  if (depositFee === null || depositFee === undefined || Number.isNaN(depositFee)) {
    errors.depositFee = [t('%field% is required', { field: 'Deposit fee' })]
  } else if (depositFee < 0 || depositFee > 10000) {
    errors.depositFee = [t('%field% must be between 0 and 10000', { field: 'Deposit fee' })]
  }

  if (withUpdate === null || withUpdate === undefined) {
    errors.withUpdate = [t('%field% is required', { field: 'With update' })]
  }

  return errors
}

const getEditFormErrors = (formData: EditFormState, t: ContextApi['t']) => {
  const { allocPoint, depositFeeBP, withUpdate } = formData
  const errors: { [key: string]: string[] } = {}

  const alloc = Number(allocPoint)
  if (allocPoint === '' || Number.isNaN(alloc)) {
    errors.allocPoint = [t('%field% is required', { field: 'Allocation points' })]
  } else if (alloc < 0) {
    errors.allocPoint = [t('%field% must be >= 0', { field: 'Allocation points' })]
  }

  const bp = Number(depositFeeBP)
  if (depositFeeBP === '' || Number.isNaN(bp)) {
    errors.depositFeeBP = [t('%field% is required', { field: 'Deposit fee (BP)' })]
  } else if (bp < 0 || bp > 10000) {
    errors.depositFeeBP = [t('%field% must be between 0 and 10000', { field: 'Deposit fee (BP)' })]
  }

  if (!withUpdate) {
    // Radio defaults true; treat false as valid input
  }

  return errors
}

const lookupConfig = (pid: number) => farmsConfig.find((c) => c.pid === pid)

const ManageFarmsModal: React.FC<ManageFarmsModalProps> = ({ tokenMode = false, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const { owner, isOwner } = useMasterGardenerOwner()
  const { pools, totalAllocPoint, isLoading, refresh } = useFetchMasterGardenerPools()
  const { onUpdate } = useUpdateFarm()

  // ----- Add new pool form state (moved from AddFarmsModal) -----
  const [addState, setAddState] = useState<AddFormState>({
    lpTokenAddress: '',
    allocPoint: 0,
    depositFee: 0,
    withUpdate: true,
  })
  const [addFieldsState, setAddFieldsState] = useState<{ [key: string]: boolean }>({})
  const [isCreating, setIsCreating] = useState(false)

  // useAddFarms captures form values at hook-call time and exposes a no-arg
  // onAddFarms callback. Pass addState directly so the callback re-creates as
  // the form changes.
  const { onAddFarms } = useAddFarms(
    addState.lpTokenAddress,
    addState.allocPoint,
    addState.depositFee,
    addState.withUpdate,
  )

  // ----- Edit existing pool form state -----
  const [editingPid, setEditingPid] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditFormState>({ allocPoint: '', depositFeeBP: '', withUpdate: true })
  const [pendingPid, setPendingPid] = useState<number | null>(null)

  const addErrors = getAddFormErrors(addState, t)
  const editErrors = editingPid !== null ? getEditFormErrors(editState, t) : {}

  const filteredPools = useMemo(() => {
    if (!tokenMode) return pools
    return pools.filter((p) => {
      const cfg = lookupConfig(p.pid)
      return cfg ? !!cfg.isTokenOnly : false
    })
  }, [pools, tokenMode])

  const handleAddChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value, type, checked } = evt.currentTarget
    setAddState((prev) => ({
      ...prev,
      [inputName]: type === 'checkbox' ? checked : value,
    }))
    setAddFieldsState((prev) => ({ ...prev, [inputName]: true }))
  }

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      await onAddFarms(addState.lpTokenAddress, addState.allocPoint, addState.depositFee, addState.withUpdate)
      toastSuccess(t('Farm Created'), t('The farm has been created!'))
      setAddState({ lpTokenAddress: '', allocPoint: 0, depositFee: 0, withUpdate: true })
      refresh()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsCreating(false)
    }
  }

  const startEdit = (pool: MasterGardenerPool) => {
    setEditingPid(pool.pid)
    setEditState({
      allocPoint: pool.allocPoint,
      depositFeeBP: String(pool.depositFeeBP),
      withUpdate: true,
    })
  }

  const cancelEdit = () => {
    setEditingPid(null)
    setEditState({ allocPoint: '', depositFeeBP: '', withUpdate: true })
  }

  const saveEdit = async (pid: number) => {
    setPendingPid(pid)
    try {
      await onUpdate(pid, editState.allocPoint, Number(editState.depositFeeBP), editState.withUpdate)
      toastSuccess(t('Pool updated'), t('Allocation points saved'))
      setEditingPid(null)
      refresh()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setPendingPid(null)
    }
  }

  const renderEditRow = (pool: MasterGardenerPool) => {
    const cfg = lookupConfig(pool.pid)
    const lpLabel = cfg ? cfg.lpSymbol : t('Unknown pool (#%pid%)', { pid: pool.pid })
    const lpAddressDisplay = cfg ? truncateAddress(getAddress(cfg.lpAddresses)) : truncateAddress(pool.lpToken)

    if (editingPid === pool.pid) {
      return (
        <Box key={pool.pid} mb="16px" p="12px" border={`1px solid ${theme.colors.cardBorder}`} borderRadius="8px">
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Text bold>
              #{pool.pid} — {lpLabel}
            </Text>
            <Text fontSize="12px" color="textSubtle">
              {lpAddressDisplay}
            </Text>
          </Flex>
          <Box mb="8px">
            <Label htmlFor={`alloc-${pool.pid}`}>{t('Alloc points')}</Label>
            <Input
              id={`alloc-${pool.pid}`}
              type="number"
              value={editState.allocPoint}
              onChange={(e) => setEditState((p) => ({ ...p, allocPoint: e.currentTarget.value }))}
              scale="md"
            />
            {editErrors.allocPoint && <FormErrors errors={editErrors.allocPoint} />}
          </Box>
          <Box mb="8px">
            <Label htmlFor={`bp-${pool.pid}`}>{t('Deposit fee (BP)')}</Label>
            <Input
              id={`bp-${pool.pid}`}
              type="number"
              value={editState.depositFeeBP}
              onChange={(e) => setEditState((p) => ({ ...p, depositFeeBP: e.currentTarget.value }))}
              scale="md"
            />
            {editErrors.depositFeeBP && <FormErrors errors={editErrors.depositFeeBP} />}
          </Box>
          <Flex mb="8px" alignItems="center">
            <Label htmlFor={`withUpdate-${pool.pid}`} mr="8px" style={{ marginBottom: 0 }}>
              {t('With update')}
            </Label>
            <Radio
              name="withUpdate"
              checked={editState.withUpdate}
              onChange={() => setEditState((p) => ({ ...p, withUpdate: true }))}
              style={{ flex: 'none' }}
            />
          </Flex>
          <Flex>
            <Button
              isLoading={pendingPid === pool.pid}
              disabled={pendingPid === pool.pid || Object.keys(editErrors).length > 0}
              onClick={() => saveEdit(pool.pid)}
              endIcon={pendingPid === pool.pid ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              mr="8px"
            >
              {t('Save')}
            </Button>
            <Button variant="text" onClick={cancelEdit} disabled={pendingPid === pool.pid}>
              {t('Cancel')}
            </Button>
          </Flex>
        </Box>
      )
    }

    const anyPending = pendingPid !== null
    const total = new BigNumber(totalAllocPoint)
    const alloc = new BigNumber(pool.allocPoint)
    const share = total.isGreaterThan(0)
      ? `${alloc.times(100).div(total).toFixed(2)}%`
      : '—'
    return (
      <TableRow key={pool.pid}>
        <CellPid>
          <Text>#{pool.pid}</Text>
        </CellPid>
        <CellLp>
          <Text bold>{lpLabel}</Text>
          <Text fontSize="12px" color="textSubtle">
            {lpAddressDisplay}
          </Text>
        </CellLp>
        <CellNumber>
          <Text>{pool.allocPoint}</Text>
        </CellNumber>
        <CellNumber>
          <Text>{(pool.depositFeeBP / 100).toFixed(2)}%</Text>
        </CellNumber>
        <CellNumber>
          <Text>{share}</Text>
        </CellNumber>
        <CellAction>
          <Button scale="sm" variant="secondary" disabled={anyPending} onClick={() => startEdit(pool)}>
            {t('Edit')}
          </Button>
        </CellAction>
      </TableRow>
    )
  }

  const titleSuffix = tokenMode ? t('Gardens') : t('Farms')

  return (
    <Modal
      title={`${t('Manage')} ${titleSuffix}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.newTrees}
      minWidth="min(95vw, 1100px)"
    >
      <ModalBody>
        {!isOwner && (
          <Box mb="16px">
            <Text color="failure">{t('You are not the contract owner')}</Text>
          </Box>
        )}
        {isOwner && owner && (
          <Box mb="16px">
            <Text fontSize="12px" color="textSubtle">
              {t('Connected as owner: %addr%', { addr: truncateAddress(owner) })}
            </Text>
          </Box>
        )}

        <SectionTitle>{t('Edit existing pools')}</SectionTitle>
        <TableHeader>
          <CellPid>
            <Text fontSize="12px" bold color="textSubtle">
              PID
            </Text>
          </CellPid>
          <CellLp>
            <Text fontSize="12px" bold color="textSubtle">
              LP Token
            </Text>
          </CellLp>
          <CellNumber>
            <Text fontSize="12px" bold color="textSubtle">
              {t('Alloc points')}
            </Text>
          </CellNumber>
          <CellNumber>
            <Text fontSize="12px" bold color="textSubtle">
              {t('Deposit fee (BP)')}
            </Text>
          </CellNumber>
          <CellNumber>
            <Text fontSize="12px" bold color="textSubtle">
              {t('Share')}
            </Text>
          </CellNumber>
          <CellAction />
        </TableHeader>

        <TotalsRow>
          <CellPid>
            <Text fontSize="12px" bold>
              Σ
            </Text>
          </CellPid>
          <CellLp>
            <Text fontSize="12px" bold>
              {t('Total')}
            </Text>
          </CellLp>
          <CellNumber>
            <Text bold>{totalAllocPoint}</Text>
          </CellNumber>
          <CellNumber />
          <CellNumber>
            <Text bold>100%</Text>
          </CellNumber>
          <CellAction />
        </TotalsRow>

        {isLoading ? (
          <Flex justifyContent="center" my="24px">
            <Text>{t('Loading pools…')}</Text>
          </Flex>
        ) : filteredPools.length === 0 ? (
          <Flex justifyContent="center" my="24px">
            <Text color="textSubtle">{t('No pools yet')}</Text>
          </Flex>
        ) : (
          filteredPools.map(renderEditRow)
        )}

        <Box mt="32px" mb="16px">
          <SectionTitle>{t('Add a pool')}</SectionTitle>
        </Box>

        {isOwner && (
          <>
            <Box mb="24px">
              <Label htmlFor="lpTokenAddress">{t('LP Token Address')}</Label>
              <Input
                id="lpTokenAddress"
                name="lpTokenAddress"
                value={addState.lpTokenAddress}
                scale="lg"
                onChange={handleAddChange}
                required
              />
              {addErrors.lpTokenAddress && addFieldsState.lpTokenAddress && (
                <FormErrors errors={addErrors.lpTokenAddress} />
              )}
            </Box>

            <Box mb="24px">
              <Label htmlFor="allocPoint">{t('Alloc points')}</Label>
              <Input
                id="allocPoint"
                name="allocPoint"
                type="number"
                value={addState.allocPoint}
                scale="lg"
                onChange={handleAddChange}
                required
              />
              {addErrors.allocPoint && addFieldsState.allocPoint && <FormErrors errors={addErrors.allocPoint} />}
            </Box>

            <Box mb="24px">
              <Label htmlFor="depositFee">{t('Deposit fee (BP)')}</Label>
              <Text as="p" color="textSubtle" fontSize="12px">
                {t('(Leave blank for 0%, base 1000, 1% = 10)')}
              </Text>
              <Input
                id="depositFee"
                name="depositFee"
                type="number"
                value={addState.depositFee}
                scale="lg"
                onChange={handleAddChange}
                required
              />
              {addErrors.depositFee && addFieldsState.depositFee && <FormErrors errors={addErrors.depositFee} />}
            </Box>

            <Box mb="24px">
              <Label htmlFor="withUpdate">{t('With update')}</Label>
              <Radio
                name="withUpdate"
                checked={addState.withUpdate}
                onChange={handleAddChange}
                style={{ flex: 'none' }}
              />
              {addErrors.withUpdate && addFieldsState.withUpdate && <FormErrors errors={addErrors.withUpdate} />}
            </Box>

            <Box>
              <Button
                isLoading={isCreating}
                disabled={Object.keys(addErrors).length > 0 || isCreating}
                onClick={handleCreate}
                endIcon={isCreating ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                id="createByAdmin"
              >
                {t('Add a pool')}
              </Button>
            </Box>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ManageFarmsModal