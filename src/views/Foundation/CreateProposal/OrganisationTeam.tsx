import React from 'react'
import { Button, Card, CardBody, CardHeader, Heading } from '@plantswap/uikit'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'contexts/Localization'
import TeamMember from './TeamMember'

export interface TeamMember {
  id: string
  value: string
}

interface ChoicesProps {
  organisationTeam: TeamMember[]
  onChange: (newChoices: TeamMember[]) => void
}

export const MINIMUM_CHOICES = 2
export const makeChoice = (): TeamMember => ({ id: uniqueId(), value: '' })

const OrganisationTeam: React.FC<ChoicesProps> = ({ organisationTeam, onChange }) => {
  const { t } = useTranslation()
  const hasMinimumChoices = organisationTeam.filter((choice) => choice.value.length > 0).length >= MINIMUM_CHOICES

  const addChoice = () => {
    onChange([...organisationTeam, makeChoice()])
  }

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Organisation team')}
        </Heading>
      </CardHeader>
      <CardBody>
        {organisationTeam.map(({ id, value }, index) => {
          const handleTextInput = (newValue: string) => {
            const newChoices = [...organisationTeam]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].value = newValue

            onChange(newChoices)
          }

          const handleRemove = () => {
            onChange(organisationTeam.filter((newPrevChoice) => newPrevChoice.id !== id))
          }

          return (
            <TeamMember
              key={id}
              scale="lg"
              onTextInput={handleTextInput}
              placeholder={t('Input team members')}
              value={value}
              onRemove={index > 1 ? handleRemove : undefined}
            />
          )
        })}

        <Button type="button" onClick={addChoice} disabled={!hasMinimumChoices}>
          {t('Add team members')}
        </Button>
      </CardBody>
    </Card>
  )
}

export default OrganisationTeam
