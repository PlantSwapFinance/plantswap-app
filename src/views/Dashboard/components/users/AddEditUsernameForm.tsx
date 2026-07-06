import React from 'react'
import { Text, Button, Input } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { FormErrors } from '../helper'

export interface IUserState {
    userId?: string
    username: string
  }

interface IAddEditForm {
    value?: IUserState
    handleSubmit?: (event: React.SyntheticEvent) => void
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    fieldsState?: { [key: string]: boolean }
    formErrors?: { [key: string]: string[] }
    onDismiss?: () => void
    locationAfterSubmit?: string
}

export const getFormErrors = (formData: IUserState, t: ContextApi['t']) => {
    const { username } = formData
    const errors: { [key: string]: string[] } = {}
  
    if (!username) {
      errors.userusernameName = [t('Username is require')]
    }
  
    return errors
  }

const AddEditForm: React.FC<IAddEditForm> = ({ value, handleSubmit, handleChange, fieldsState, formErrors, onDismiss, locationAfterSubmit }) => {
    const { t } = useTranslation()

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
            {value && (
                <Input 
                    type="hidden" 
                    name="userId" 
                    id="userId"
                    value={value ? value.userId : null}
                />
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