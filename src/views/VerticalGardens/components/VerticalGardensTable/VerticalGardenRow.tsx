import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@plantswap/uikit'
import { VerticalGarden } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import EarningsPlantCell from './Cells/EarningsPlantCell'
import AprCell from './Cells/AprCell'
import AprPlantCell from './Cells/AprPlantCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'

interface VerticalGardenProps {
  verticalGarden: VerticalGarden
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const VerticalGardenRow: React.FC<VerticalGardenProps> = ({ verticalGarden, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell verticalGarden={verticalGarden} />
        <EarningsPlantCell verticalGarden={verticalGarden} account={account} userDataLoaded={userDataLoaded} />
        <EarningsCell verticalGarden={verticalGarden} account={account} userDataLoaded={userDataLoaded} />
        <AprPlantCell verticalGarden={verticalGarden} />
        <AprCell verticalGarden={verticalGarden} />
        {(isLg || isXl) && <TotalStakedCell verticalGarden={verticalGarden} />}
        <ExpandActionCell expanded={expanded} isFullLayout={isMd || isLg || isXl} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          verticalGarden={verticalGarden}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl }}
        />
      )}
    </>
  )
}

export default VerticalGardenRow
