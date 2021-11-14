import React, { useState } from 'react'
import styled from 'styled-components'
import pagesApi from 'utils/calls/pages'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageCard from './PageCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const PageList = ({ pageListLoaded, setPageListLoaded }) => {
  const { t } = useTranslation()

  const [pageList, setPageList] = useState([])

  if(!pageListLoaded) {
    pagesApi.readAllPages().then((pages) => {
      setPageList(pages)
      setPageListLoaded(true)
    })
  }

  return (
    <>
      <Grid>
        {pageList.length > 0 && pageList.map((page) => (
          <>
          <PageCard 
            key={page.pageId} 
            page={page} 
            pageId={page.data.pageId} 
            setPageListLoaded={setPageListLoaded}
          />
          </>
        ))}
      </Grid>
      {pageList.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No page yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default PageList
