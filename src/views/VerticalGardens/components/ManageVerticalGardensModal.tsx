import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Modal, Text, Button, AutoRenewIcon, ModalBody, Box, Input, Flex } from '@plantswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { verticalGardensConfig } from 'config/constants'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useMasterGardenerOwner from 'hooks/useMasterGardenerOwner'
import useFetchMasterGardenerPools from '../../Farms/hooks/useFetchMasterGardenerPools'
import useUpdateFarm from '../../Farms/hooks/useUpdateFarm'

interface ManageVerticalGardensModalProps {
  onDismiss?: () => void
}

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
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

const CellVgId = styled(Box)`
  width: 50px;
  flex-shrink: 0;
  font-family: monospace;
`

const CellLabel = styled(Box)`
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

const getEditFormErrors = (allocPoint: string, t: ContextApi['t']) => {
  const errors: string[] = []
  const alloc = Number(allocPoint)
  if (allocPoint === '' || Number.isNaN(alloc)) {
    errors.push(t('%field% is required', { field: 'Allocation points' }))
  } else if (alloc < 0) {
    errors.push(t('%field% must be >= 0', { field: 'Allocation points' }))
  }
  return errors
}

const ManageVerticalGardensModal: React.FC<ManageVerticalGardensModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const { owner, isOwner } = useMasterGardenerOwner()
  const { totalAllocPoint } = useFetchMasterGardenerPools()
  const { onUpdate, isPending } = useUpdateFarm()

  const [editingVgId, setEditingVgId] = useState<number | null>(null)
  const [allocPointDraft, setAllocPointDraft] = useState('')
  const [pendingPid, setPendingPid] = useState<number | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const editErrors = editingVgId !== null ? getEditFormErrors(allocPointDraft, t) : []

  const startEdit = (vgId: number, currentAllocPt: number) => {
    setEditingVgId(vgId)
    setAllocPointDraft(String(currentAllocPt))
  }

  const cancelEdit = () => {
    setEditingVgId(null)
    setAllocPointDraft('')
  }

  const saveEdit = async (masterGardenerPId: number) => {
    setPendingPid(masterGardenerPId)
    try {
      // Vertical gardens share the master gardener's `set()` for their alloc point.
      // `depositFeeBP` is left at the contract default (0) — owner can adjust per-pool
      // via the Farms Manage modal where depositFeeBP is editable.
      await onUpdate(masterGardenerPId, allocPointDraft, 0, true)
      toastSuccess(t('Pool updated'), t('Allocation points saved'))
      setEditingVgId(null)
      setRefreshIndex((p) => p + 1)
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setPendingPid(null)
    }
  }

  const anyPending = pendingPid !== null

  return (
    <Modal
      title={t('Manage Vertical Gardens')}
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
          <CellVgId>
            <Text fontSize="12px" bold color="textSubtle">
              VG
            </Text>
          </CellVgId>
          <CellLabel>
            <Text fontSize="12px" bold color="textSubtle">
              {t('LP Token')}
            </Text>
          </CellLabel>
          <CellNumber>
            <Text fontSize="12px" bold color="textSubtle">
              MG PID
            </Text>
          </CellNumber>
          <CellNumber>
            <Text fontSize="12px" bold color="textSubtle">
              {t('Alloc points')}
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
          <CellVgId>
            <Text fontSize="12px" bold>
              Σ
            </Text>
          </CellVgId>
          <CellLabel>
            <Text fontSize="12px" bold>
              {t('Total')}
            </Text>
          </CellLabel>
          <CellNumber />
          <CellNumber>
            <Text bold>{totalAllocPoint}</Text>
          </CellNumber>
          <CellNumber>
            <Text bold>100%</Text>
          </CellNumber>
          <CellAction />
        </TotalsRow>

        {verticalGardensConfig.length === 0 ? (
          <Flex justifyContent="center" my="24px">
            <Text color="textSubtle">{t('No pools yet')}</Text>
          </Flex>
        ) : (
          verticalGardensConfig.map((vg) => {
            const pid = vg.verticalGardenMasterGardenerPId
            const allocPt = vg.verticalGardenMasterGardenerAllocPt
            const symbol = vg.stakingToken?.symbol ?? `VG #${vg.vgId}`
            const key = `${vg.vgId}-${refreshIndex}`

            if (editingVgId === vg.vgId) {
              return (
                <Box
                  key={key}
                  mb="16px"
                  p="12px"
                  border={`1px solid ${theme.colors.cardBorder}`}
                  borderRadius="8px"
                >
                  <Flex justifyContent="space-between" alignItems="center" mb="8px">
                    <Text bold>
                      #{vg.vgId} — {symbol}
                    </Text>
                    <Text fontSize="12px" color="textSubtle">
                      MG PID {pid}
                    </Text>
                  </Flex>
                  <Box mb="8px">
                    <Label htmlFor={`alloc-${vg.vgId}`}>{t('Alloc points')}</Label>
                    <Input
                      id={`alloc-${vg.vgId}`}
                      type="number"
                      value={allocPointDraft}
                      onChange={(e) => setAllocPointDraft(e.currentTarget.value)}
                      scale="md"
                    />
                    {editErrors.length > 0 && <FormErrors errors={editErrors} />}
                  </Box>
                  <Flex>
                    <Button
                      isLoading={pendingPid === pid}
                      disabled={pendingPid === pid || editErrors.length > 0}
                      onClick={() => saveEdit(pid)}
                      endIcon={pendingPid === pid ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                      mr="8px"
                    >
                      {t('Save')}
                    </Button>
                    <Button variant="text" onClick={cancelEdit} disabled={pendingPid === pid}>
                      {t('Cancel')}
                    </Button>
                  </Flex>
                </Box>
              )
            }

            const total = new BigNumber(totalAllocPoint)
            const allocBn = new BigNumber(allocPt ?? 0)
            const share = total.isGreaterThan(0)
              ? `${allocBn.times(100).div(total).toFixed(2)}%`
              : '—'

            return (
              <TableRow key={key}>
                <CellVgId>
                  <Text>#{vg.vgId}</Text>
                </CellVgId>
                <CellLabel>
                  <Text bold>{symbol}</Text>
                </CellLabel>
                <CellNumber>
                  <Text>{pid ?? '-'}</Text>
                </CellNumber>
                <CellNumber>
                  <Text>{allocPt ?? 0}</Text>
                </CellNumber>
                <CellNumber>
                  <Text>{share}</Text>
                </CellNumber>
                <CellAction>
                  <Button scale="sm" variant="secondary" disabled={anyPending || pid === undefined} onClick={() => startEdit(vg.vgId, allocPt ?? 0)}>
                    {t('Edit')}
                  </Button>
                </CellAction>
              </TableRow>
            )
          })
        )}
        {isPending && (
          <Text fontSize="12px" color="textSubtle" mt="8px">
            {t('Loading pools…')}
          </Text>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ManageVerticalGardensModal