import React from 'react'
import { Button, Card, CardBody, CardHeader, Heading, Text } from '@plantswap/uikit'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'contexts/Localization'
import Address from './Address'

export interface Address {
  id: string
  value: string
}

interface AddresssProps {
  websiteAndSocialList: Address[]
  onChange: (newAddress: Address[]) => void
}

export const MINIMUM_ADDRESS = 1
export const makeAddress = (): Address => ({ id: uniqueId(), value: '' })

const WebsiteAndSocialList: React.FC<AddresssProps> = ({ websiteAndSocialList, onChange }) => {
  const { t } = useTranslation()
  const hasMinimumAddresss = websiteAndSocialList.filter((address) => address.value.length > 0).length >= MINIMUM_ADDRESS

  const addAddress = () => {
    onChange([...websiteAndSocialList, makeAddress()])
  }

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Website and social medial')}
        </Heading>
        <Text>{t('This information will be used to confirm the validity of this proposal')}</Text>
      </CardHeader>
      <CardBody>
        <Text small>{t('Add these prefixes to label each input')}</Text>
        <Text small>{t('website/https://example.com')}</Text>
        <Text small>{t('twitter/@plantswapdefi')}</Text>
        {websiteAndSocialList.map(({ id, value }, index) => {
          const handleTextInput = (newValue: string) => {
            const newAddresss = [...websiteAndSocialList]
            const choiceIndex = newAddresss.findIndex((newAddress) => newAddress.id === id)

            newAddresss[choiceIndex].value = newValue

            onChange(newAddresss)
          }

          const handleRemove = () => {
            onChange(websiteAndSocialList.filter((newPrevAddress) => newPrevAddress.id !== id))
          }

          return (
                <Address
                  key={id}
                  scale="lg"
                  onTextInput={handleTextInput}
                  placeholder={t('Label / Website or Social media username')}
                  value={value}
                  onRemove={index > 1 ? handleRemove : undefined}
                />
          )
        })}

        <Button type="button" onClick={addAddress} disabled={!hasMinimumAddresss}>
          {t('Add Address')}
        </Button>
      </CardBody>
    </Card>
  )
}

export default WebsiteAndSocialList
