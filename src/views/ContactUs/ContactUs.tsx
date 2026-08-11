import React, { useState } from 'react'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Flex, EndPage, Text, Input, Button } from '@plantswap/uikit'
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
              {t('Contact-Us')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Learn how to connect your wallet to Plantswap')}
              <br />
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/roadmap.svg" alt="Gardens" width={600} height={315} loading="lazy" decoding="async" />
          </Flex>
        </Flex>
      </PageHeader>

      <Page>
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