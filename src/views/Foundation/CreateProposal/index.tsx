import React, { ChangeEvent, FormEvent, lazy, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  PencilConfigIcon,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  LinkExternal,
  Input,
  Text,
} from '@plantswap/uikit'
import { useWeb3React } from '@web3-react/core'
import times from 'lodash/times'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { DEFAULT_GAS_LIMIT } from 'config'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import Container from 'components/Layout/Container'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useFoundationNonProfit } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import ReactMarkdown from 'components/ReactMarkdown'
import BreadcrumbLink from '../components/BreadcrumbLink'
import { FormState } from './types'
import Layout from '../components/Layout'
import { FormErrors, Label } from './styles'
import OrganisationTeam, { TeamMember, makeChoice, MINIMUM_CHOICES } from './OrganisationTeam'
import WebsiteAndSocialList, { Address, makeAddress, MINIMUM_ADDRESS } from './WebsiteAndSocialList'
import { getFormErrors } from './helpers'
import { ADMIN_ADDRESS } from '../config'

const EasyMde = lazy(() => import('components/EasyMde'))
const TeamSelection = lazy(() => import('./TeamSelection'))

const StyledCard = styled(Card)`
  z-index: 1;
  position: absolute;
  top: 0px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(360deg, rgba(60, 123, 71, 0.9) 0%, rgba(30, 78, 38, 0.9) 100%)'
      : 'linear-gradient(180deg, rgba(218, 255, 224, 0.9) 0%,  rgba(185, 254, 197, 0.9) 51.04%, rgba(170, 230, 180, 0.9) 100%)'};
`

const gasOptions = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const CreateProposal = () => {
  const [state, setState] = useState<FormState>({
    name: '',
    body: '',
    donationAddress: '',
    teamId: 1,
    logoUrl: 'https://',
    organisationTeam: times(MINIMUM_CHOICES).map(makeChoice),
    websiteAndSocialList: times(MINIMUM_ADDRESS).map(makeAddress),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()
  
  const { name, body, donationAddress, logoUrl, teamId, organisationTeam, websiteAndSocialList } = state
  const formErrors = getFormErrors(state, t)
  const foundationNonProfitContract = useFoundationNonProfit()
  
  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    
    try {
      setIsLoading(true)
      
    const tx = await foundationNonProfitContract.submitProposal(name, donationAddress, logoUrl, teamId, gasOptions)
    // eslint-disable-next-line
    const receipt = await tx.wait()
    toastSuccess(t('Proposal created!'))
    } catch (error) {
      toastError(t('Error'), error?.message || error?.error)
      console.error(error)
      setIsLoading(false)
    }
  }

  

  const updateValue = (key: string, value: string | number | TeamMember[] | Address[]) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleChoiceChange = (newChoices: TeamMember[]) => {
    updateValue('organisationTeam', newChoices)
  }

  const handleAddressChange = (newWebsiteAndSocialList: Address[]) => {
    updateValue('websiteAndSocialList', newWebsiteAndSocialList)
  }

  const handleTeamChange = (value: number) => {
    updateValue('teamId', value)
  }

  const options = useMemo(
    () => ({
      hideIcons: account === ADMIN_ADDRESS ? [] : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }),
    [account],
  )

  return (
    <>
    <Container py="40px">
    <StyledCard>
      <CardBody p={['16px', null, null, '24px']}>
        <Flex alignItems="center" justifyContent="center" flexDirection={['column', null, null, 'row']}>
          <Flex>
            <PencilConfigIcon width={80} height={80} />
          </Flex>
          <Flex flex="1" width={['100%', null, 'auto']}>
            <Text>This section is in progress, the smart contract and user interface are finished, we now need to finish the connection in-between the website and the contract.
              <br />
              Follow us on social medial to stay updated!</Text>
          </Flex>
        </Flex>
      </CardBody>
    </StyledCard>
      <Box mb="48px" padding="24px">
        <Breadcrumbs>
          <BreadcrumbLink to="/">{t('Home')}</BreadcrumbLink>
          <BreadcrumbLink to="/foundation">{t('Foundation')}</BreadcrumbLink>
          <Text>{t('Make a Proposal')}</Text>
        </Breadcrumbs>
      </Box>
      <form onSubmit={handleSubmit}>
        <Layout>
          <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Name of the ecological non-profit')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
              {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
            </Box>
            <Box mb="24px">
              <Label htmlFor="body">{t('Description of the organization, their goal the use of the donations, and more')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <EasyMde
                id="body"
                name="body"
                onTextChange={handleEasyMdeChange}
                value={body}
                options={options}
                required
              />
            </Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Donation address')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: wallet address compatible with Binance Smart Chain BEP-20 token')}
              </Text>
              <Input id="donationAddress" name="donationAddress" value={donationAddress} scale="lg" onChange={handleChange} required />
              {formErrors.donationAddress && fieldsState.donationAddress && <FormErrors errors={formErrors.donationAddress} />}
            </Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Organisation logo url')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: transparent background .png logo')}
              </Text>
              <Input id="logoUrl" name="logoUrl" value={logoUrl} scale="lg" onChange={handleChange} required />
              {formErrors.logoUrl && fieldsState.logoUrl && <FormErrors errors={formErrors.logoUrl} />}
            </Box>
            <Box mb="24px">
              <OrganisationTeam organisationTeam={organisationTeam} onChange={handleChoiceChange} />
              {formErrors.organisationTeam && fieldsState.organisationTeam && <FormErrors errors={formErrors.organisationTeam} />}
            </Box>
            {body && (
              <Box mb="24px">
                <Card>
                  <CardHeader>
                    <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading>
                  </CardHeader>
                  <CardBody p="0" px="24px">
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </CardBody>
                </Card>
              </Box>
            )}
          </Box>
            <Box mb="24px">
              <TeamSelection currentTeamId={teamId} onChange={handleTeamChange} />
              <WebsiteAndSocialList websiteAndSocialList={websiteAndSocialList} onChange={handleAddressChange} />
              {formErrors.websiteAndSocialList && fieldsState.websiteAndSocialList && <FormErrors errors={formErrors.websiteAndSocialList} />}
            </Box>
          {account && (
            <Flex alignItems="center" mb="8px">
              <Text color="textSubtle" mr="16px">
                {t('Creator')}
              </Text>
              <LinkExternal href={getBscScanLink(account, 'address')}>
                {truncateWalletAddress(account)}
              </LinkExternal>
            </Flex>
          )}
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>
                {account ? (
                  <>
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                      disabled={!isEmpty(formErrors)}
                      mb="16px"
                    >
                      {t('Submit')}
                    </Button>
                  </>
                ) : (
                  <ConnectWalletButton width="100%" type="button" />
                )}
              </CardBody>
            </Card>
          </Box>
        </Layout>
      </form>
    </Container>
    </>
  )
}

export default CreateProposal
