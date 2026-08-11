import React, { useState } from 'react'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import {
  Heading,
  Flex,
  EndPage,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Link,
  Box,
  HelpIcon,
  TeamPlayerIcon,
  MegaphoneIcon,
  VerifiedIcon,
} from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import contactApi from 'utils/calls/contact'
import Divider from './components/Divider'

interface ContactFormState {
  clientName: string
  email: string
  sujet: string
  message: string
  honeypot: string
}

const initialState: ContactFormState = {
  clientName: '',
  email: '',
  sujet: '',
  message: '',
  honeypot: '',
}

const ContactUs = () => {
  const { t } = useTranslation()
  const [state, setState] = useState<ContactFormState>(initialState)
  const [send, setSend] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  const clearState = () => setState(initialState)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setErrorMessage(null)
    try {
      const result = await contactApi.submitContact(state)
      if (result && result.ok) {
        clearState()
        setSend(true)
      } else {
        setErrorMessage(result && result.error ? result.error : 'Failed to send your message')
      }
    } catch (err) {
      console.error('contact-us submit failed', err)
      setErrorMessage('Failed to send your message')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Get in touch')}
            </Heading>
            <Heading as="h2" scale="lg" color="text" mb="16px">
              {t('We are a small team building a DeFi platform that funds tree planting and rainforest protection.')}
            </Heading>
            <Text color="textSubtle">
              {t(
                'Use the form below for partnerships, press, support, and security reports. We read every message and usually reply within a few business days.',
              )}
            </Text>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/plant-question.svg" alt="Contact" width={400} height={400} loading="lazy" decoding="async" />
          </Flex>
        </Flex>
      </PageHeader>

      <Page>
        <SectionTitle>{t('What can we help you with?')}</SectionTitle>
        <CardGrid>
          <ReasonCard>
            <CardBody>
              <IconCircle>
                <HelpIcon width="24px" color="secondary" />
              </IconCircle>
              <Heading scale="md" mb="8px">
                {t('Wallet & swap support')}
              </Heading>
              <Text color="textSubtle" fontSize="14px">
                {t(
                  'Stuck swap, missing token, RPC errors, or transaction that will not confirm. Include your wallet address and a transaction hash when relevant.',
                )}
              </Text>
            </CardBody>
          </ReasonCard>

          <ReasonCard>
            <CardBody>
              <IconCircle>
                <TeamPlayerIcon width="24px" color="secondary" />
              </IconCircle>
              <Heading scale="md" mb="8px">
                {t('Partnerships & listings')}
              </Heading>
              <Text color="textSubtle" fontSize="14px">
                {t(
                  'Token listings, farms or gardens integrations, cross-chain bridges, environmental non-profits, and other collaboration proposals.',
                )}
              </Text>
            </CardBody>
          </ReasonCard>

          <ReasonCard>
            <CardBody>
              <IconCircle>
                <MegaphoneIcon width="24px" color="secondary" />
              </IconCircle>
              <Heading scale="md" mb="8px">
                {t('Press & media')}
              </Heading>
              <Text color="textSubtle" fontSize="14px">
                {t(
                  'Interviews, articles, podcasts, and brand assets. Reach out with your outlet, deadline, and angle and we will get back quickly.',
                )}
              </Text>
            </CardBody>
          </ReasonCard>

          <ReasonCard>
            <CardBody>
              <IconCircle>
                <VerifiedIcon width="24px" color="secondary" />
              </IconCircle>
              <Heading scale="md" mb="8px">
                {t('Security disclosures')}
              </Heading>
              <Text color="textSubtle" fontSize="14px">
                {t(
                  'Found a vulnerability in our contracts or front end? Please report it privately. Do not post details publicly until we have responded.',
                )}
              </Text>
            </CardBody>
          </ReasonCard>
        </CardGrid>

        <Divider />

        <SectionTitle>{t('Send us a message')}</SectionTitle>
        <Text color="textSubtle" mb="24px">
          {t('Fill in the form and we will reply to the email you provide. Required fields are marked by your browser.')}
        </Text>

        {send && (
          <Flex alignItems="center" mb="16px">
            <Text color="success" mr="16px">
              {t('Your message has been sent!')}
            </Text>
          </Flex>
        )}
        {errorMessage && (
          <Flex alignItems="center" mb="16px">
            <Text color="failure" mr="16px">
              {t(errorMessage)}
            </Text>
          </Flex>
        )}
        <form id="form" onSubmit={handleSubmit}>
          <HoneypotField>
            <label htmlFor="honeypot">Leave this field empty</label>
            <input
              type="text"
              id="honeypot"
              name="honeypot"
              value={state.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </HoneypotField>

          <Flex mb="16px">
            <Text color="textSubtle" mr="16px">
              {t('Your name')}
            </Text>
          </Flex>
          <Flex mb="16px">
            <Input
              type="text"
              name="clientName"
              id="clientName"
              value={state.clientName}
              required
              onChange={handleChange}
              disabled={sending}
            />
          </Flex>
          <Flex mb="16px">
            <Text color="textSubtle" mr="16px">
              {t('Your email')}
            </Text>
          </Flex>
          <Flex mb="16px">
            <Input
              type="email"
              name="email"
              id="email"
              value={state.email}
              required
              onChange={handleChange}
              disabled={sending}
            />
          </Flex>
          <Flex mb="16px">
            <Text color="textSubtle" mr="16px">
              {t('Subjet')}
            </Text>
          </Flex>
          <Flex mb="16px">
            <Input
              type="text"
              name="sujet"
              id="sujet"
              value={state.sujet}
              required
              onChange={handleChange}
              disabled={sending}
            />
          </Flex>
          <Flex mb="16px">
            <Text color="textSubtle" mr="16px">
              {t('Message')}
            </Text>
          </Flex>
          <Flex mb="16px">
            <Textarea
              name="message"
              id="message"
              value={state.message}
              required
              onChange={handleChange}
              disabled={sending}
            />
          </Flex>
          <Flex alignItems="center" mb="16px">
            <Button type="submit" id="button" value="Send Email" disabled={sending || send}>
              {sending ? t('Sending...') : t('Send your message')}
            </Button>
          </Flex>
        </form>

        <Divider />

        <SectionTitle>{t('Other ways to reach us')}</SectionTitle>
        <Text color="textSubtle" mb="16px">
          {t('Prefer a public channel? Find us here:')}
        </Text>
        <Box>
          <Link external href="https://github.com/plantswapfinance">
            GitHub
          </Link>
          <Text as="span" color="textSubtle" mx="8px">
            ·
          </Text>
          <Link external href="https://plantswapfinance.medium.com">
            {t('Blog')}
          </Link>
          <Text as="span" color="textSubtle" mx="8px">
            ·
          </Text>
          <Link href="/roadmap">{t('Roadmap')}</Link>
        </Box>
        <Box mt="16px">
          <Text color="textSubtle" fontSize="14px">
            {t('We typically respond within 2–3 business days. For urgent security issues, mark the subject with "Security".')}
          </Text>
        </Box>

        <Divider />
        <EndPage />
      </Page>
    </>
  )
}

export default ContactUs

const Textarea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.input};
  border: 0;
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  display: block;
  height: 200px;
  font-size: 16px;
  outline: 0;
  padding: 16px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`

const HoneypotField = styled.div`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
`

const SectionTitle = styled(Heading).attrs({ as: 'h2', scale: 'xl' })`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 16px;
`

const CardGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

const ReasonCard = styled(Card)`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const IconCircle = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.tertiary};
  border-radius: 999px;
  display: inline-flex;
  height: 48px;
  justify-content: center;
  margin-bottom: 16px;
  width: 48px;
`