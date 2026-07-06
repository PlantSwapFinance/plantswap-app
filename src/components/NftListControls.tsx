import React from 'react'
import styled from 'styled-components'
import { Text, Toggle } from '@plantswap/uikit'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'

export interface NftListControlToggle {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}

export interface NftListSortOption {
  label: string
  value: string
}

interface NftListControlsProps {
  /** The view-mode toggle element (typically <ToggleView />). Caller owns the ViewMode type. */
  viewToggle: React.ReactNode
  /** Toggle controls rendered next to the view toggle. Pass an empty array if none. */
  toggles: NftListControlToggle[]
  /** Options for the sort dropdown. */
  sortOptions: NftListSortOption[]
  onSortChange: (option: OptionProps) => void
  /** Localized placeholder for the search input. */
  searchPlaceholder: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const NftListControls = ({
  viewToggle,
  toggles,
  sortOptions,
  onSortChange,
  searchPlaceholder,
  onSearchChange,
}: NftListControlsProps) => (
  <ControlContainer>
    <ViewControls>
      {viewToggle}
      {toggles.map((toggle) => (
        <ToggleWrapper key={toggle.label}>
          <Toggle
            checked={toggle.checked}
            onChange={(e) => toggle.onChange(e.target.checked)}
            scale="sm"
          />
          <Text> {toggle.label}</Text>
        </ToggleWrapper>
      ))}
    </ViewControls>
    <FilterContainer>
      <LabelWrapper>
        <Text textTransform="uppercase">Sort by</Text>
        <Select
          options={sortOptions.map((o) => ({ label: o.label, value: o.value }))}
          onChange={onSortChange}
        />
      </LabelWrapper>
      <LabelWrapper style={{ marginLeft: 16 }}>
        <Text textTransform="uppercase">Search</Text>
        <SearchInput onChange={onSearchChange} placeholder={searchPlaceholder} />
      </LabelWrapper>
    </FilterContainer>
  </ControlContainer>
)

export default NftListControls
