import React from 'react'
import styled from 'styled-components'
import { Image } from '@plantswap/uikit'
import { CollectiblesFarm } from 'state/types'
import BaseCell from './BaseCell'

interface SvgCellProps {
  collectiblesFarm: CollectiblesFarm
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 50px;
    padding-left: 24px;
  }
`

const SvgCell: React.FC<SvgCellProps> = ({ collectiblesFarm }) => {
  const { label, labelSvg } = collectiblesFarm


  const srclabelSvg = `/images/nfts/${labelSvg}`

  return (
    <StyledCell role="cell">
      {labelSvg ? (
        <Image src={srclabelSvg} alt={label} width={72} height={72} />
      ) : (
        <>
          {/* + Add NftToken from UIKit */}
          <Image src="/images/nfts/0xA7C25c199BC8Dd06c4Edd2Ea8aEbCeC40A404c03.svg" alt={label} width={72} height={72} />
        </>
      )}
    </StyledCell>
  )
}

export default SvgCell
