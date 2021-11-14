export type TableProps = {
  data?: TableDataTypes[]
  selectedFilters?: string
  sortBy?: string
  sortDir?: string
  onSort?: (value: string) => void
}

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  sortable: boolean
}

export type ScrollBarProps = {
  ref: string
  width: number
}

export type TableDataTypes = {
  POOL: string
  APR: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'image',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'name',
    sortable: true,
    label: '',
  },
  {
    id: 3,
    name: 'description',
    sortable: true,
    label: 'Description',
  },
  {
    id: 4,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'image',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'name',
    sortable: true,
    label: '',
  },
  {
    id: 3,
    name: 'description',
    sortable: true,
    label: 'Description',
  },
  {
    id: 4,
    name: 'more',
    sortable: true,
    label: '',
  },
  {
    id: 5,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export enum ViewMode {
  'TABLE' = 'TABLE',
  'CARD' = 'CARD',
}
