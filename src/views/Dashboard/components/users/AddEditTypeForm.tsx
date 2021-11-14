import React from 'react'
import { Text, Button, Input } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { FormErrors } from '../helper'

interface IAddEditForm {
    value?: any
    handleSubmit?: any
    handleChange?: any
    fieldsState?: any
    formErrors?: any
    onDismiss?: any
    locationAfterSubmit?: any
}

export interface IUserTypeState {
    userTypeId?: string
    userTypeName: string
    userTypeCode: string
    userTypeInternalDescription?: string
    userTypePublicDescription?: string
}

export const getFormErrors = (formData: IUserTypeState, t: ContextApi['t']) => {
    const { userTypeName, userTypeCode } = formData
    const errors: { [key: string]: string[] } = {}
  
    if (!userTypeName) {
      errors.userTypeName = [t('User Type Name is require')]
    }
    if (!userTypeCode) {
      errors.userTypeName = [t('User Type Name is require')]
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
        <form id="formAddUserType" onSubmit={handleSubmit}>
            <Text fontSize="18px" mb="8px" bold>{t('UserType name')}</Text>
            {value && (
                <Input 
                    type="text" 
                    name="userTypeId" 
                    id="userTypeId"
                    value={value ? value.userTypeId : null}
                />
            )}
            <Input 
                type="text" 
                name="userTypeName" 
                id="userTypeName"
                value={value ? value.userTypeName : null}
                required
                onChange={handleChange} 
            />
            {formErrors.userTypeName && fieldsState.userTypeName && <FormErrors errors={formErrors.userTypeName} />}
            <Text fontSize="18px" mb="8px" bold>{t('UserType #code')}</Text>
            <Input 
                type="text" 
                name="userTypeCode" 
                id="userTypeCode"
                value={value ? value.userTypeShortName : null}
                required
                onChange={handleChange} 
            />
            {formErrors.userTypeShortName && fieldsState.userTypeShortName && <FormErrors errors={formErrors.userTypeShortName} />}
            <Text fontSize="18px" mb="8px" bold>{t('UserType internal description')}</Text>
            <Input 
                type="text" 
                name="userTypeInternalDescription" 
                id="userTypeInternalDescription"
                value={value ? value.userTypeDescription : null}
                onChange={handleChange} 
            /><Text fontSize="18px" mb="8px" bold>{t('UserType public description')}</Text>
            <Input 
                type="text" 
                name="userTypePublicDescription" 
                id="userTypePublicDescription"
                value={value ? value.userTypeDescription : null}
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
            {t(value ? 'Edit userType' : 'Create UserType')}
            </Button>
      </form>
    )
}

export default AddEditForm