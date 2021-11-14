import React, { useState } from 'react'
import styled from 'styled-components'
import pagesApi from 'utils/calls/pages'
import { Flex, Heading } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageAccessCard from './PageAccessCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const PageAccess = ({ pageAccessLoaded, setPageAccessLoaded }) => {
  const { t } = useTranslation()

  const [pageAccess, setPageAccess] = useState([])

  if(!pageAccessLoaded) {
    pagesApi.readAllPages().then((pages) => {
      setPageAccess(pages)
      setPageAccessLoaded(true)
    })
  }

  return (
    <>
      <Grid>
        {pageAccess.length > 0 && pageAccess.map((page) => (
          <>
          <PageAccessCard 
            key={page.pageId} 
            page={page} 
            pageId={page.data.pageId} 
            setPageAccessLoaded={setPageAccessLoaded}
          />
          </>
        ))}
      </Grid>
      {pageAccess.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" scale="md" color="textDisabled">
            {t('No page yet!')}
          </Heading>
        </Flex>
      )}
    </>
  )
}

export default PageAccess
