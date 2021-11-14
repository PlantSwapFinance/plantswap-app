import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@plantswap/uikit'
import { CollectiblesFarm } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import SvgCell from './Cells/SvgCell'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'

interface CollectiblesFarmProps {
  collectiblesFarm: CollectiblesFarm
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const CollectiblesFarmRow: React.FC<CollectiblesFarmProps> = ({ collectiblesFarm, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <SvgCell collectiblesFarm={collectiblesFarm} />
        <NameCell collectiblesFarm={collectiblesFarm} />
        <EarningsCell collectiblesFarm={collectiblesFarm} account={account} userDataLoaded={userDataLoaded} />
        <AprCell collectiblesFarm={collectiblesFarm} />
        {(isLg || isXl) && <TotalStakedCell collectiblesFarm={collectiblesFarm} />}
        <ExpandActionCell expanded={expanded} isFullLayout={isMd || isLg || isXl} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          collectiblesFarm={collectiblesFarm}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl }}
        />
      )}
    </>
  )
}

export default CollectiblesFarmRow
