import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Button, Input, Grid, Radio } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import usersApi from 'utils/calls/users'
import { FormErrors, RadioTextStyled } from '../helper'

interface IAddEditForm {
    value?: any
    handleSubmit?: any
    handleChange?: any
    fieldsState?: any
    formErrors?: any
    onDismiss?: any
    locationAfterSubmit?: any
}

export interface IUserState {
    userId?: string
    username: string,
    userType: string,
    password?: string,
    email: string,
    telephone: string
  }

export const getFormErrors = (formData: IUserState, t: ContextApi['t']) => {
    const { username, email } = formData
    const errors: { [key: string]: string[] } = {}

    const handleVerifyEmail = (value) => {
        // eslint-disable-next-line no-useless-escape
        const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        if (regexp.test(value)) {
            return true
        }
        return false
      }
  
    if (!username) {
      errors.userusernameName = [t('Username is require')]
    }
  
    if (!email) {
      errors.email = [t('Email is require')]
    }
      
    if (email && !handleVerifyEmail(email)) {
      errors.email = [t('This email is not valid')]
    }
  
    return errors
  }

const AddEditForm: React.FC<IAddEditForm> = ({ value, handleSubmit, handleChange, fieldsState, formErrors, onDismiss, locationAfterSubmit }) => {
    const { t } = useTranslation()
    const [userType, setUserType] = useState([])
    const [userTypeLoaded, setUserTypeLoaded] = useState(false)

    if (!userTypeLoaded) {
        usersApi.readAllUsersType()
            .then((res) => {
                setUserType(res)
                setUserTypeLoaded(true)
            }).catch(err => {
                console.error(err)
                setUserTypeLoaded(true)
            })
    }
    const [userTypeCode, setUserTypeCode] = useState('')

    const handleSubmitType = () => {
        if (locationAfterSubmit) {
            window.location.href = locationAfterSubmit
        } else {
            onDismiss()
        }
    }
    return (
        <form id="formAddUser" onSubmit={handleSubmit}>
            <Text fontSize="18px" mb="8px" bold>{t('Username')}</Text>
            {value ? (
                <Input 
                    type="hidden" 
                    name="userId" 
                    id="userId"
                    value={value ? value.userId : null}
                />
            ) : (
                <>
                    <Input
                        type="hidden"
                        name="emailSubject"
                        id="emailSubject"
                        value="Your ESportsCentral account has been created!"
                    />
                    <Input
                        type="hidden"
                        name="emailBody"
                        id="emailBody"
                        value={`Your account on ${window.location.origin} has been created!
                        
                        
                        ${window.location.origin}`}
                    />
                </>
            )}
            <Input 
                type="text" 
                name="username" 
                id="username"
                value={value ? value.username : null}
                required
                onChange={handleChange} 
            />
            {formErrors.username && fieldsState.username && <FormErrors errors={formErrors.username} />}
            <Text fontSize="18px" mb="8px" bold>{t('User Type')}</Text>
            <Grid>
                <StyledSelectBox>
                    <RadioTextStyled>
                        {userType && userType.length > 0 && userType.map((item) => (
                            <>
                            <RadioTextStyled> 
                                <StyledRadio 
                                    type="radio" 
                                    name="userType" 
                                    value={item.data.userTypeCode}
                                    checked={(userTypeCode && userTypeCode === item.data.userTypeCode) || (value && value.userType === item.data.userTypeCode)}
                                    onChange={(e) => {
                                            handleChange(e)
                                            setUserTypeCode(item.data.userTypeCode)
                                        }
                                    }
                                />&nbsp;{t(item.data.userTypeCode)}&nbsp;
                                </RadioTextStyled>
                            </>
                        ))}
                    </RadioTextStyled>
                </StyledSelectBox>
            </Grid>
            {!value && (
                <>
                    <Text fontSize="20px" mb="8px" bold>{t('Password')}</Text>
                    <Input 
                        type="password" 
                        name="password" 
                        id="password"
                        required
                        onChange={handleChange} 
                    />
                </>
            )}
            <Text fontSize="18px" mb="8px" bold>{t('Email')}</Text>
            <Input 
                type="text" 
                name="email" 
                id="email"
                value={value ? value.email : null}
                required
                onChange={handleChange} 
            />
            {formErrors.email && fieldsState.email && <FormErrors errors={formErrors.email} />}
            <Text fontSize="18px" mb="8px" bold>{t('Telephone')}</Text>
            <Input 
                type="text" 
                name="telephone" 
                id="telephone"
                value={value ? value.telephone : null}
                onChange={handleChange} 
            />
            <br />
            <Button 
                type="submit" 
                id="button" 
                value="ENTER"
                onClick={(e) => {
                    handleSubmit(e)
                    handleSubmitType()
                }}>
            {t(value ? 'Edit user' : 'Create User')}
            </Button>
      </form>
    )
}

export default AddEditForm

const StyledSelectBox = styled.div`
    width: 100%;
    border: 2px solid ${({ theme }) => theme.colors.input};
    border-radius: 25px;
    padding: 4px;
    margin-top: 4px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.primary};
    }  
`

const StyledRadio = styled(Radio)`
    border: 2px solid ${({ theme }) => theme.colors.input};
    border-radius: 25px;
    padding: 8px;
    margin: 0 1vw;
    margin-bottom: 8px;
    align-items: center;
    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.primary};
    }
`