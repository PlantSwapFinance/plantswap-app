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

export interface IPageState {
    pageId?: string
    pageName: string
    pageShortName: string
    pageDescription?: string
  }

export const getFormErrors = (formData: IPageState, t: ContextApi['t']) => {
    const { pageName, pageShortName } = formData
    const errors: { [key: string]: string[] } = {}
  
    if (!pageName) {
      errors.pageName = [t('Page name is require')]
    }
    if (!pageShortName) {
      errors.pageShortName = [t('Page short-name is require')]
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
        <form id="formAddPage" onSubmit={handleSubmit}>
            <Text fontSize="18px" mb="8px" bold>{t('Page name')}</Text>
            {value && (
                <Input 
                    type="text" 
                    name="pageId" 
                    id="pageId"
                    value={value ? value.pageId : null}
                />
            )}
            <Input 
                type="text" 
                name="pageName" 
                id="pageName"
                value={value ? value.pageName : null}
                required
                onChange={handleChange} 
            />
            {formErrors.pageName && fieldsState.pageName && <FormErrors errors={formErrors.pageName} />}
            <Text fontSize="18px" mb="8px" bold>{t('Page short-name')}</Text>
            <Input 
                type="text" 
                name="pageShortName" 
                id="pageShortName"
                value={value ? value.pageShortName : null}
                required
                onChange={handleChange} 
            />
            {formErrors.pageShortName && fieldsState.pageShortName && <FormErrors errors={formErrors.pageShortName} />}
            <Text fontSize="18px" mb="8px" bold>{t('Page description')}</Text>
            <Input 
                type="text" 
                name="pageDescription" 
                id="pageDescription"
                value={value ? value.pageDescription : null}
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
            {t(value ? 'Edit page' : 'Create Page')}
            </Button>
      </form>
    )
}

export default AddEditForm