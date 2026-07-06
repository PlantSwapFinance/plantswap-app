import React from 'react'
import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from '@plantswap/uikit'

export enum ViewMode {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

interface ToggleViewProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
  /** Optional className applied to the outer container for layout overrides. */
  className?: string
  /**
   * Optional id prefix forwarded to the underlying IconButtons.
   * Produces `${id}CardView` and `${id}TableView` to mirror the
   * `clickPool*` / `clickGarden*` analytics hooks used historically.
   */
  id?: string
}

const Container = styled.div`
  margin-left: -8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`

const ToggleView: React.FC<ToggleViewProps> = ({ viewMode, onToggle, className, id }) => {
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode)
    }
  }

  const cardId = id ? `${id}CardView` : undefined
  const tableId = id ? `${id}TableView` : undefined

  return (
    <Container className={className}>
      <IconButton variant="text" scale="sm" id={cardId} onClick={() => handleToggle(ViewMode.CARD)}>
        <CardViewIcon color={viewMode === ViewMode.CARD ? 'primary' : 'textDisabled'} />
      </IconButton>
      <IconButton variant="text" scale="sm" id={tableId} onClick={() => handleToggle(ViewMode.TABLE)}>
        <ListViewIcon color={viewMode === ViewMode.TABLE ? 'primary' : 'textDisabled'} />
      </IconButton>
    </Container>
  )
}

export default ToggleView