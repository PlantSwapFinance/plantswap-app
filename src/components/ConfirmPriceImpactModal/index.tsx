import React, { useState } from 'react'
import styled from 'styled-components'
import { Percent } from '@pancakeswap/sdk'
import { Button, Input, Message, Modal, ModalBody, Text, InjectedModalProps } from '@plantswap/uikit'

import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from 'config/constants'

/**
 * z-index above the theme's `zIndices.modal` (100) so this modal stacks on top of
 * `ConfirmSwapModal` (also rendered via the global ModalProvider slot) when both
 * are open in non-expert mode.
 */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
`

const CenteredWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 201;
  padding: 0 16px;
`

interface ConfirmPriceImpactModalProps extends InjectedModalProps {
  priceImpactWithoutFee: Percent
  onConfirm: () => void
}

const ConfirmPriceImpactModal: React.FC<ConfirmPriceImpactModalProps> = ({
  priceImpactWithoutFee,
  onConfirm,
  onDismiss,
}) => {
  const requiresTypedConfirm = !priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)
  const [confirmText, setConfirmText] = useState('')

  const title = requiresTypedConfirm ? 'Confirm High Price Impact' : 'High Price Impact'
  const message = requiresTypedConfirm
    ? `This swap has a price impact of at least ${PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
        0,
      )}%. Please type the word "confirm" to continue with this swap.`
    : `This swap has a price impact of at least ${ALLOWED_PRICE_IMPACT_HIGH.toFixed(
        0,
      )}%. Please confirm that you would like to continue with this swap.`

  return (
    <>
      <Backdrop role="presentation" onClick={onDismiss} />
      <CenteredWrapper>
        <Modal title={title} onDismiss={onDismiss} style={{ maxWidth: '420px' }}>
          <ModalBody>
            <Message variant="warning" mb="24px">
              <Text>{message}</Text>
            </Message>
            {requiresTypedConfirm && (
              <Input
                scale="lg"
                placeholder="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                mb="24px"
              />
            )}
            <Button
              width="100%"
              variant="danger"
              disabled={requiresTypedConfirm && confirmText !== 'confirm'}
              onClick={onConfirm}
            >
              Confirm
            </Button>
            <Button mt="8px" width="100%" variant="tertiary" onClick={onDismiss}>
              Cancel
            </Button>
          </ModalBody>
        </Modal>
      </CenteredWrapper>
    </>
  )
}

export default ConfirmPriceImpactModal