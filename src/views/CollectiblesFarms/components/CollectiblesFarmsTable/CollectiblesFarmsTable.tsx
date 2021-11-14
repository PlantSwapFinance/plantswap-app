import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { CollectiblesFarm } from 'state/types'
import CollectiblesFarmRow from './CollectiblesFarmRow'

interface CollectiblesFarmsTableProps {
  collectiblesFarms: CollectiblesFarm[]
  userDataLoaded: boolean
  account: string
}

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const CollectiblesFarmsTable: React.FC<CollectiblesFarmsTableProps> = ({ collectiblesFarms, userDataLoaded, account }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {collectiblesFarms.map((collectiblesFarm) => (
          <CollectiblesFarmRow
            key={collectiblesFarm.cfId}
            collectiblesFarm={collectiblesFarm}
            account={account}
            userDataLoaded={userDataLoaded}
          />
        ))}
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default CollectiblesFarmsTable
