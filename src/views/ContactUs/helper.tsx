import React from 'react';
import styled from 'styled-components'
import { Flex } from '@plantswap/uikit'

interface ContactFormState {
    clientName: string;
    email: string;
    sujet: string;
    message: string;
}

export const getContactFormErrors = (formData: ContactFormState) => {
    const { clientName, email, sujet } = formData
    const errors: { [key: string]: string[] } = {}
  
    if (!clientName) {
      errors.clientName = ['Votre nom est requis']
    }
  
    if (!email) {
      errors.email = ['Votre courriel est requis']
    }
  
    if (!sujet) {
      errors.sujet = ['Le sujet est requis']
    }
  
  
    return errors
}

  
export const FormError: React.FC = ({ children }) => (
    <Errors>
      {children}
    </Errors>
)
  
export const FormErrors: React.FC<{ errors: string[] }> = ({ errors }) => {
    return (
      <Flex alignItems="center" mb="16px">
        {errors.map((error) => {
            return <FormError key={error}>{error}</FormError>
        })}
      </Flex>
    )
}

const Errors = styled.div`
  color: #DC0D00;
  font-size: 16px;
  font-weight:  400;
  line-height: 1.5;
`;