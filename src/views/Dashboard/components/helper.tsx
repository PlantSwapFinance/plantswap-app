import React from 'react'
import styled from 'styled-components'

export const Errors = styled.div`
color: #DC0D00;
font-size: 16px;
font-weight:  400;
line-height: 1.1;
`;

export const FormError: React.FC = ({ children }) => (
    <Errors>
      {children}
    </Errors>
  )

export const FormErrors: React.FC<{ errors: string[] }> = ({ errors }) => {
    return (
        <>
            <br />
            {errors.map((error) => {
                return <FormError key={error}>{error}</FormError>
            })}
        </>
    )
}

export const SelectStyled = styled.div`
    margin-bottom: 8px;
    padding-bottom: 4vh;
    width: 100%;
    display: block;
`

export const RadioTextStyled = styled.div`
    color: ${({ theme }) => theme.colors.textSubtle};
    float: left;
    vertical-align: middle;
`