import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
// import { GardenWithStakedValue } from 'views/Gardens/components/GardenCard/GardenCard'
import { useMatchBreakpoints } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import Image, { ImageProps } from './Image'
import Name, { NameProps } from './Name'
import Description, { DescriptionProps } from './Description'
import More, { MoreProps } from './More'
import Extra, { ExtraProps } from './Extra'
import Details from './Details'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

export interface RowProps {
  image: ImageProps
  name: NameProps
  description: DescriptionProps
  more: MoreProps
  details: ExtraProps
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  image: Image,
  name: Name,
  description: Description,
  more: More,
  details: Extra,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`


const GardenMobileCell = styled.td`
  padding-top: 24px;
`

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { userDataReady } = props
  const hasStakedAmount = null // !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])

  const { isXl, isXs } = useMatchBreakpoints()

  const isMobile = !isXl
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }

            switch (key) {
              case 'details':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t(tableSchema[columnIndex].label)}>
                        {React.createElement(cells[key], { ...props[key], userDataReady })}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
            }
          })}
        </StyledTr>
      )
    }

    return (
      <StyledTr onClick={toggleActionPanel}>
        <td>
          <tr>
            <GardenMobileCell>
              <CellLayout>
                <Image {...props.image} />
              </CellLayout>
            </GardenMobileCell>
          </tr>
          <tr>
            <GardenMobileCell>
              <CellLayout>
                <Name {...props.name} />
              </CellLayout>
            </GardenMobileCell>
          </tr>
          <tr>
            <GardenMobileCell>
              <CellLayout>
                <Description {...props.description} />
              </CellLayout>
            </GardenMobileCell>
          </tr>
          <tr>
            <EarnedMobileCell>
              <CellLayout label={t('Description')}>
                <More {...props.more} />
              </CellLayout>
            </EarnedMobileCell>
          </tr>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={6}>
            <Extra {...props} expanded={actionPanelExpanded}  />
          </td>
        </tr>
      )}
    </>
  )
  return null
}

export default Row
