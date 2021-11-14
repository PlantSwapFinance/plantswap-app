import React, { useState } from 'react'
import styled from 'styled-components'
import emailjs from 'emailjs-com'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { Heading, Flex, EndPage, Text, Input, Button } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from './components/Divider'
import { getContactFormErrors, FormErrors } from './helper'

interface ContactFormState {
  clientName: string;
  email: string;
  sujet: string;
  message: string;
}

const ContactUs = () => {
  const { t } = useTranslation()
  const [send, setSend] = useState(false)
  const [state, setState] = useState<ContactFormState>({
    clientName: '',
      email: '',
      sujet: '',
      message: '',
      })
  // eslint-disable-next-line
  const { clientName, email, sujet, message } = state
  // eslint-disable-next-line
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const formErrors = getContactFormErrors(state)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  const clearState = () => setState({
    clientName: '',
      email: '',
      sujet: '',
      message: '',
      })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    emailjs
      .sendForm(
        'service_2heraoe', 'template_revj3os', e.target, 'user_LncbCjsg709omIRnMnAH3'
      )
      .then(
        () => {
          clearState()
          setSend(true)
        },
        (error) => {
          console.error(error.text)
        }
      ) 
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
              {t('Learn how to connect your wallet to Plantswap')}<br />
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <img src="/images/roadmap.svg" alt="Gardens" width={600} height={315} />
          </Flex>
        </Flex>
      </PageHeader>

      <Page>
      {send && (
          <Flex alignItems="center" mb="16px">
              <Text color="success" mr="16px">{t('Your message has been sent!')}</Text>
          </Flex>
        )}
        <form id="form" onSubmit={handleSubmit}>
        <Flex mb="16px">
            <Text color="textSubtle" mr="16px">{t('Your name')}</Text>
            <Input
              type="hidden"
              name="emailSubject"
              id="emailSubject"
              value={`Subject: ${sujet} From: ${clientName}`}
            />
            <Input
              type="hidden"
              name="emailBody"
              id="emailBody"
              value={`Subject: ${sujet}\n
              From: ${clientName}\n
              Email: ${email}\n
              Message: ${message}\n
              \n\n\n
              Sent from ESportsCentral.ca`}
            />
        </Flex>
          <Flex mb="16px">
              <Input 
                type="text" 
                name="clientName" 
                id="clientName"
                required
                onChange={handleChange}
              />
              {formErrors.clientName && fieldsState.clientName && <FormErrors errors={formErrors.clientName} />}
          </Flex>
          <Flex mb="16px">
              <Text color="textSubtle" mr="16px">{t('Your email')}</Text>
          </Flex>
          <Flex mb="16px">
              <Input 
                type="text" 
                name="email" 
                id="email"
                required
                onChange={handleChange}
              />
              {formErrors.email && fieldsState.email && <FormErrors errors={formErrors.email} />}
          </Flex>
          <Flex mb="16px">
              <Text color="textSubtle" mr="16px">{t('Subjet')}</Text>
          </Flex>
          <Flex mb="16px">
              <Input 
                type="text" 
                name="sujet" 
                id="sujet"
                required
                onChange={handleChange} 
              />
              {formErrors.sujet && fieldsState.sujet && <FormErrors errors={formErrors.sujet} />}
          </Flex>
        {clientName && (
          <>
            <Flex mb="16px">
                <Text color="textSubtle" mr="16px">{t('Message')}</Text>
            </Flex>
            <Flex mb="16px">
                <Textarea 
                  name="message" 
                  id="message"
                  value={message}
                  required
                  onChange={handleChange} 
                />
                {formErrors.message && fieldsState.message && <FormErrors errors={formErrors.message} />}
            </Flex>
            <Flex alignItems="center" mb="16px">
                <Button 
                  type="submit" 
                  id="button" 
                  value="Send Email"
                  onClick={() => handleSubmit}
                  disabled={send}>
                  {t('Send your message')}
                </Button>
            </Flex>
            </>
        )}
            {send && (
                <Flex alignItems="center" mb="16px">
                    <Text color="success" mr="16px">{t('Your message has been sent!')}</Text>
                </Flex>
            )}
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
  padding: 0 16px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};

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
`;
