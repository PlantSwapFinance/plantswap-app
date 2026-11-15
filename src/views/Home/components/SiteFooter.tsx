import React, { useState } from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { ChainId } from '@pancakeswap/sdk'
import { Box, Flex, Text, Link, IconButton, CopyIcon } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import tokens from 'config/constants/tokens'
import { getBscScanLink } from 'utils'

const PLANT_ADDRESS = tokens.plant.address[ChainId.BSC]

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const StyledFooter = styled.footer`
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const Columns = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`

const ColumnList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li + li {
    margin-top: 8px;
  }
`

const ContractRow = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const AddressBox = styled(Flex)`
  align-items: center;
  max-width: 100%;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  padding-left: 16px;
`

const Address = styled(Text)`
  font-family: monospace;
  overflow-wrap: anywhere;
`

const FooterLinkItem: React.FC<FooterLink> = ({ label, href, external }) =>
  external ? (
    <Link external href={href} fontSize="14px" color="textSubtle">
      {label}
    </Link>
  ) : (
    <Link as={RouterLink} to={href} fontSize="14px" color="textSubtle">
      {label}
    </Link>
  )

const CopyPlantAddress: React.FC = () => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(PLANT_ADDRESS).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <AddressBox>
      <Address fontSize="14px" title={PLANT_ADDRESS}>
        {PLANT_ADDRESS}
      </Address>
      <IconButton
        variant="text"
        scale="sm"
        onClick={copy}
        aria-label={copied ? t('Copied') : t('Copy PLANT contract address')}
        title={copied ? t('Copied') : t('Copy')}
      >
        <CopyIcon color={copied ? 'success' : 'primary'} width="18px" />
      </IconButton>
    </AddressBox>
  )
}

const SiteFooter: React.FC = () => {
  const { t } = useTranslation()

  const columns: FooterColumn[] = [
    {
      title: t('Docs'),
      links: [
        { label: t('Documentation'), href: '/documentation' },
        { label: t('Docs site'), href: 'https://docs.plantswap.finance/', external: true },
        { label: t('Roadmap'), href: '/roadmap' },
        { label: t('Development Fund'), href: '/developmentFund' },
      ],
    },
    {
      title: t('Community'),
      links: [
        { label: t('Twitter'), href: 'https://twitter.com/plantswapdefi', external: true },
        { label: t('Telegram'), href: 'https://t.me/plantswapfinance', external: true },
        { label: t('Announcements'), href: 'https://t.me/plantswapfinance_announcement', external: true },
        { label: t('Blog'), href: 'https://plantswapfinance.medium.com', external: true },
        { label: t('Governance'), href: 'https://snapshot.box/#/s:plantswap.eth', external: true },
      ],
    },
    {
      title: t('Developers'),
      links: [
        { label: t('GitHub'), href: 'https://github.com/PlantSwapFinance', external: true },
        {
          label: t('Smart contracts'),
          href: 'https://github.com/PlantSwapFinance/plantswapfinance-contracts',
          external: true,
        },
        { label: t('PLANT on BscScan'), href: getBscScanLink(PLANT_ADDRESS, 'token'), external: true },
      ],
    },
    {
      title: t('Security'),
      links: [
        { label: t('Audits'), href: '/roadmap' },
        {
          label: t('Verified contract source'),
          href: `${getBscScanLink(PLANT_ADDRESS, 'address')}#code`,
          external: true,
        },
        { label: t('Report a vulnerability'), href: '/contact-us' },
      ],
    },
    {
      title: t('Contact'),
      links: [{ label: t('Contact us'), href: '/contact-us' }],
    },
  ]

  return (
    <StyledFooter>
      <Container py="48px">
        <Columns aria-label={t('Footer')}>
          {columns.map((column) => (
            <Box key={column.title}>
              <Text bold mb="12px">
                {column.title}
              </Text>
              <ColumnList>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem {...link} />
                  </li>
                ))}
              </ColumnList>
            </Box>
          ))}
        </Columns>
        <ContractRow mt="40px" pt="24px">
          <Box>
            <Text bold fontSize="14px">
              {t('PLANT contract address (BNB Smart Chain)')}
            </Text>
            <Text fontSize="12px" color="textSubtle">
              {t('Always verify the address before trading.')}
            </Text>
          </Box>
          <CopyPlantAddress />
        </ContractRow>
        <Text mt="24px" fontSize="12px" color="textSubtle">
          © {new Date().getFullYear()} PlantSwap
        </Text>
      </Container>
    </StyledFooter>
  )
}

export default SiteFooter
