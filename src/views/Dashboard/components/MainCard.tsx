import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Heading, Text, Card, CardHeader, CardBody, CardFooter } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface Links {
  title: string
  description?: string
  link: string
  icon: any
}

interface MainCardProps {
  header: string
  mainLinks?: Links[]
  footerLinks?: Links[]
}

const MainCard: React.FC<MainCardProps> = ({ header, mainLinks, footerLinks }) => {
  const { t } = useTranslation()
  if (mainLinks && mainLinks.length > 0) {
    return (
      <Card mb="3vh">
        <CardHeader variant="blue" >
          <Heading scale="lg"  mb="2vh">
            {t(header)}
          </Heading>
        </CardHeader>
        <CardBody>
          {mainLinks && mainLinks.map((link) => (
            <Button variant="secondary" p="2vh" pt="4vh" pb="4vh" m="1vh" startIcon={link.icon} as={RouterLink} to={link.link}>
              {link.title && <Text fontSize="2.5vh" bold>{t(link.title)}</Text>}
              {link.description && <Text fontSize="2vh" color="textSubtle">{t(link.description)}</Text>}
            </Button>
          ))}
        </CardBody>
        {footerLinks && (
          <CardFooter>
            {footerLinks.map((link) => (
              <Button variant="secondary" p="2vh" m="2vh" startIcon={link.icon} as={RouterLink} to={link.link}>
                {link.title && <Text fontSize="2.5vh" color="primary" bold>{t(link.title)}</Text>}
                {link.description && <Text fontSize="2vh" color="textSubtle">{t(link.description)}</Text>}
              </Button>
            ))}
          </CardFooter>
        )}
      </Card>
    )
  }
  return null
}

export default MainCard
