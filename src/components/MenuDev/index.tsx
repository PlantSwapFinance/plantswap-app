import React from 'react'
import { Menu } from '@plantswap/uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePricePlantBusd } from 'state/farms/hooks'
import { useProfile } from 'state/profile/hooks'
import config from './config'
import UserMenu from './UserMenu'

const MenuDev = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const plantPriceUsd = usePricePlantBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()

  return (
    <Menu
      userMenu={<UserMenu />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      plantPriceUsd={plantPriceUsd.toNumber()}
      links={config(t)}
      profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: !profile?.username,
      }}
      {...props}
    />
  )
}

export default MenuDev
