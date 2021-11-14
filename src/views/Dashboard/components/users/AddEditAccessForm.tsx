import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Button, Input, Grid, Radio } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import usersApi from 'utils/calls/users'
import usernamesApi from 'utils/calls/usernames'
import pagesApi from 'utils/calls/pages'
import { FormErrors, SelectStyled, RadioTextStyled } from '../helper'

interface IAddEditForm {
    value?: any
    handleSubmit?: any
    handleChange?: any
    fieldsState?: any
    formErrors?: any
    onDismiss?: any
    locationAfterSubmit?: any
}

export interface IUserAccessState {
    userAccessId?: string
    userAccessType: string
    userId?: string
    userTypeCode?: string
    userAccessPageShortName?: string
    userAccessPagesActionId?: string
}

export const getFormErrors = (formData: IUserAccessState, t: ContextApi['t']) => {
    const { userAccessType } = formData
    const errors: { [key: string]: string[] } = {}
  
    if (!userAccessType) {
      errors.userAccessType = [t('User Access Type is require')]
    }
    return errors
  }
  

const AddEditForm: React.FC<IAddEditForm> = ({ value, handleSubmit, handleChange, fieldsState, formErrors, onDismiss, locationAfterSubmit }) => {
    const { t } = useTranslation()
    const [userType, setUserType] = useState([])
    const [userTypeLoaded, setUserTypeLoaded] = useState(false)
    const [usernames, setUsernames] = useState([])
    const [usernamesLoaded, setUsernamesLoaded] = useState(false)
    const [pages, setPages] = useState([])
    const [pagesLoaded, setPagesLoaded] = useState(false)

    if (!userTypeLoaded) {
        usersApi.readAllUsersType()
            .then(res => {
                setUserType(res)
                setUserTypeLoaded(true)
            }).catch(err => {
                console.error(err)
                setUserTypeLoaded(true)
            })
    }
    if (!usernamesLoaded) {
        usernamesApi.readAllUsernames()
            .then(res => {
                setUsernames(res)
                setUsernamesLoaded(true)
            }).catch(err => {
                console.error(err)
                setUsernamesLoaded(true)
            })
    }
    if (!pagesLoaded) {
        pagesApi.readAllPages()
            .then(res => {
                setPages(res)
                setPagesLoaded(true)
            }).catch(err => {
                console.error(err)
                setPagesLoaded(true)
            })
    }

    const handleSubmitType = () => {
        if (locationAfterSubmit) {
            window.location.href = locationAfterSubmit
        } else {
            onDismiss()
        }
    }

    const [userTypeCode, setUserTypeCode] = useState('')
    const [userAccessType, setUserAccessType] = useState('')
    const [userIdSelected, setUserIdSelected] = useState('')
    const [pageIdSelected, setPageIdSelected] = useState('')

    return (
        <form id="formAddUserAccess" onSubmit={handleSubmit}>
            <Text fontSize="18px" mb="8px" bold>{t('User Access Type')}</Text>
            {value && (
                <Input 
                    type="text" 
                    name="userAccessId" 
                    id="userAccessId"
                    value={value ? value.userAccessId : null}
                />
            )}
            <SelectStyled>
                <RadioTextStyled> 
                    <Radio 
                        type="radio" 
                        name="userAccessType" 
                        value="userType" 
                        checked={userAccessType === "userType"}
                        onChange={(e) => {
                                handleChange(e)
                                setUserAccessType('userType')
                            }
                        } 
                    />&nbsp;{t('User Type')}&nbsp;
                    <Radio 
                        type="radio" 
                        name="userAccessType" 
                        value="userId"
                        checked={userAccessType === "userId"}
                        onChange={(e) => {
                                handleChange(e)
                                setUserAccessType('userId')
                            }
                        }
                    />&nbsp;{t('User Id')}&nbsp;
                </RadioTextStyled>
            </SelectStyled>
            {formErrors.userAccessType && fieldsState.userAccessType && <FormErrors errors={formErrors.userAccessType} />}
            {(!userAccessType || userAccessType === 'userType') && (
                <>
                    <Text fontSize="18px" mb="8px" bold>{t('User Access UserTypeCode')}</Text>
                    <Grid>
                        <StyledSelectBox>
                            <RadioTextStyled>
                                {userType && userType.length > 0 && userType.map((item) => (
                                    <>
                                    <RadioTextStyled> 
                                        <StyledRadio 
                                            type="radio" 
                                            name="userTypeCode" 
                                            value={item.data.userTypeCode}
                                            checked={(userTypeCode === item.data.userTypeCode) || (value && value.userTypeCode === item.data.userTypeCode)}
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
                    {formErrors.userTypeCode && fieldsState.userTypeCode && <FormErrors errors={formErrors.userTypeCode} />}
                </>
            )}
            {userAccessType === 'userId' && (
                <>
                    <Text fontSize="18px" mb="8px" bold>{t('User Access UserId')}</Text>
                    <Grid>
                        <StyledSelectBox>
                            <RadioTextStyled>
                                {usernames && usernames.length > 0 && usernames.map((item) => (
                                    <>
                                    <RadioTextStyled> 
                                        <StyledRadio 
                                            type="radio" 
                                            name="userId" 
                                            value={item.data.userId}
                                            checked={(userIdSelected === item.data.userId) || (value && value.userId === item.data.userId)}
                                            onChange={(e) => {
                                                    handleChange(e)
                                                    setUserIdSelected(item.data.userId)
                                                }
                                            }
                                        />&nbsp;{t(item.data.username)}&nbsp;
                                        </RadioTextStyled>
                                    </>
                                ))}
                            </RadioTextStyled>
                        </StyledSelectBox>
                    </Grid>
                </>
            )}
            <Text fontSize="18px" mb="8px" bold>{t('User Access Page ShortName')}</Text>
            <Grid>
                <StyledSelectBox>
                    <RadioTextStyled>
                        {pages && pages.length > 0 && pages.map((item) => (
                            <>
                            <RadioTextStyled> 
                                <StyledRadio 
                                    type="radio" 
                                    name="userAccessPageShortName" 
                                    value={item.data.pageShortName}
                                    checked={(pageIdSelected === item.data.pageShortName) || (value && value.userAccessPageShortName === item.data.pageShortName)}
                                    onChange={(e) => {
                                            handleChange(e)
                                            setPageIdSelected(item.data.pageShortName)
                                        }
                                    }
                                />&nbsp;{t(item.data.pageName)}&nbsp;
                                </RadioTextStyled>
                            </>
                        ))}
                    </RadioTextStyled>
                </StyledSelectBox>
            </Grid>
            {fieldsState.userTest && (
                <>
                    <Text fontSize="18px" mb="8px" bold>{t('User Access UserId')}</Text>
                </>
            )}
            <Text fontSize="18px" mb="8px" bold>{t('User Access PagesActionId')}</Text>
            <Input 
                type="text" 
                name="userAccessPagesActionId" 
                id="userAccessPagesActionId"
                value={value ? value.userAccessUserTypeId : null}
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
            {t(value ? 'Edit userAccess' : 'Create UserAccess')}
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