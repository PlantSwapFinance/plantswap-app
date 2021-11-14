import React from 'react'
import { Card, CardBody, CardHeader, Flex, Heading, Text, LogoIcon, CardViewIcon, ListViewIcon, PencilIcon, CogIcon, LogoRoundIcon, OpenNewIcon, HelpIcon,
  CommunityIcon, HistoryIcon, TimerIcon } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import MainCard from './components/MainCard'

const Main = ({ userId, userAccess, userTypeAccess }) => {
  const { t } = useTranslation()
  // Main
  const linkMainBookings = []
  const linkMainUsers = []
  const linkMainItems = []
  const linkMainMenu = []
  const linkMainPages = []
  const linkMainServices = []
  const linkMainTasks = []
  const linkMainInventory = []
  const linkMainSetting = []
  const linkMainVelClient = []
  // Footer
  const linkFooterBookings = []
  const linkFooterUsers = []
  const linkFooterItems = []
  const linkFooterMenu = []
  const linkFooterPages = []
  const linkFooterServices = []
  const linkFooterTasks = []
  const linkFooterInventory = []
  const linkFooterSetting = []
  const linkFooterVelClient = []

  const handleAddRoute = (route) => {
    if (userId) {
      /* Bookings */
      if (route === 'dashboard-booking') {
        linkMainBookings.push({
          title: t('Booking List'),
          icon: <TimerIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/bookings'
        })
        linkMainBookings.push({
          title: t('Calendar Events'),
          icon: <HistoryIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/calendarEvents'
        })
        linkFooterBookings.push({
          title: t('Add a reservation'),
          icon: <OpenNewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/bookings/create'
        })
        linkFooterBookings.push({
          title: t('Add a event'),
          icon: <OpenNewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/calendarEvents/create'
        })
      }
      /* Users */
      if (route === 'dashboard-users') {
        linkMainUsers.push({
          title: t('Users List'),
          icon: <LogoIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/users'
        })
        linkFooterUsers.push({
          title: t('Add/Invite a user'),
          icon: <LogoIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/users/create'
        })
      }
      if (route === 'dashboard-usersAccess') {
        linkMainUsers.push({
          title: t('Users Access'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/usersAccess'
        })
        linkFooterUsers.push({
          title: t('Give Usser Access'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/usersAccess/create'
        })
      }
      if (route === 'dashboard-usersType') {
        linkMainUsers.push({
          title: t('Users Type'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/usersType'
        })
        linkFooterUsers.push({
          title: t('Create User Type'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/usersType/create'
        })
      }
      if (route === 'dashboard-usernames') {
        linkMainUsers.push({
          title: t('Usernames List'),
          icon: <CommunityIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/usernames'
        })
        linkFooterUsers.push({
          title: t('Reserve/Block a username'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/usernames/create'
        })
      }
      /* Items */
      if (route === 'dashboard-items') {
        linkMainItems.push({
          title: t('Items List'),
          icon: <CardViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/items'
        })
        linkFooterItems.push({
          title: t('Create Items'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/items/create'
        })
      }
      if (route === 'dashboard-itemsCategory') {
        linkMainItems.push({
          title: t('Items Category'),
          icon: <CardViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/itemsCategory'
        })
        linkFooterItems.push({
          title: t('Create Item Category'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/itemsCategory/create'
        })
      }
      if (route === 'dashboard-itemsDivision') {
        linkMainItems.push({
          title: t('Items Division'),
          icon: <CardViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/itemsDivision'
        })
        linkFooterItems.push({
          title: t('Create Item Division'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/itemsDivision/create'
        })
      }
      /* Menu */
      if (route === 'dashboard-menuScreens') {
        linkMainMenu.push({
          title: t('Menu Screens'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/menuScreens'
        })
        linkFooterMenu.push({
          title: t('Create Menu Screens'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/menuScreens/create'
        })
      }
      if (route === 'dashboard-menuCategories') {
        linkMainMenu.push({
          title: t('Menu Category'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/menuCategories'
        })
        linkFooterMenu.push({
          title: t('Create Menu Category'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/menuCategories/create'
        })
      }
      if (route === 'dashboard-higlightedItems') {
        linkMainMenu.push({
          title: t('Higlighted Items'),
          icon: <CardViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/higlightedItems'
        })
        linkFooterMenu.push({
          title: t('Create Higlighted Items'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/higlightedItems/create'
        })
      }
      /* Pages */
      if (route === 'dashboard-pages') {
        linkMainPages.push({
          title: t('Pages List'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/pages'
        })
        linkFooterPages.push({
          title: t('Create a Pages'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/pages/create'
        })
      }
      if (route === 'dashboard-pagesAccess') {
        linkMainPages.push({
          title: t('Pages Access'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/pagesAccess'
        })
        linkFooterPages.push({
          title: t('Create page access'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/pagesAccess/create'
        })
      }
      /* Services */
      if (route === 'dashboard-services') {
        linkMainServices.push({
          title: t('Services List'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/services'
        })
        linkMainServices.push({
          title: t('FAQ'),
          icon: <HelpIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/faq'
        })
        linkMainServices.push({
          title: t('Games List'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/games'
        })
        linkFooterServices.push({
          title: t('Create a Services'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/services/create'
        })
        linkFooterServices.push({
          title: t('Add a Q/A'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/faq/create'
        })
        linkFooterServices.push({
          title: t('Add a game'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/games/create'
        })
      }
      /* Tasks */
      if (route === 'dashboard-tasks') {
        linkMainTasks.push({
          title: t('Tasks Manager'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/tasksManager'
        })
        linkFooterTasks.push({
          title: t('Assign a tasklist'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/tasksManager/create'
        })
      }
      if (route === 'dashboard-tasksList') {
        linkMainTasks.push({
          title: t('Tasks List'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/tasksList'
        })
        linkFooterTasks.push({
          title: t('Create a tasklist'),
          icon: <OpenNewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/tasksList/create'
        })
      }
      if (route === 'dashboard-tasksListModel') {
        linkMainTasks.push({
          title: t('Tasks List Model'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/tasksListModel'
        })
        linkFooterTasks.push({
          title: t('Create a tasklist model'),
          icon: <OpenNewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/tasksListModel/create'
        })
      }
      /* Inventory */
      if (route === 'dashboard-inventory') {
        linkMainInventory.push({
          title: t('Inventory List'),
          icon: <CardViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/inventory'
        })
        linkFooterInventory.push({
          title: t('Create a Inventory'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/inventory/create'
        })
      }
      if (route === 'dashboard-inventoryModel') {
        linkMainInventory.push({
          title: t('Inventory Model'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/inventoryModel'
        })
        linkFooterInventory.push({
          title: t('Create a Inventory Model'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/inventoryModel/create'
        })
      }
      if (route === 'dashboard-inventoryLocation') {
        linkMainInventory.push({
          title: t('Inventory Location'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/inventoryLocation'
        })
        linkFooterInventory.push({
          title: t('Create a Inventory Location'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/inventoryLocation/create'
        })
      }
      /* Setting */
      if (route === 'dashboard-setting') {
        linkMainSetting.push({
          title: t('Setting'),
          icon: <CogIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/setting'
        })
        linkFooterSetting.push({
          title: t('Create Setting'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/setting/create'
        })
      }
      if (route === 'dashboard-settingUsers') {
        linkMainSetting.push({
          title: t('Setting Users'),
          icon: <LogoRoundIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/settingUsers'
        })
        linkFooterSetting.push({
          title: t('Create Setting Users'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/settingUsers/create'
        })
      }
      /* Vel Client */
      if (route === 'dashboard-velClient') {
        linkMainVelClient.push({
          title: t('Vel Client'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/velClient'
        })
        linkMainVelClient.push({
          title: t('VelRobot Items List'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/velRobotItems'
        })
        linkMainVelClient.push({
          title: t('VelRobot Items Screens'),
          icon: <ListViewIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/velRobotItemsScreens'
        })
        linkFooterVelClient.push({
          title: t('Create Vel Client'),
          icon: <PencilIcon width="18px" color="textSubtle" mr="4px" />,
          link: '/dashboard/velClient/create'
        })
      }
    }
  }
  if (userAccess) {
    userAccess.map((route) => {
      handleAddRoute(route.data.userAccessPageShortName)
      return null
    })
  }
  if (userTypeAccess) {
    userTypeAccess.map((route) => {
      handleAddRoute(route.data.userAccessPageShortName)
      return null
    })
  }


  return (
    <>
      <Card mb="32px">
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading scale="lg" mb="8px">
                {t('Dashboard')}
              </Heading>
              <Text as="p">{t('The list all the main section of the Dashboard')}</Text>
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <MainCard 
            header={t('Bookings & Calendar')}
            mainLinks={linkMainBookings}
            footerLinks={linkFooterBookings}
          />
          <MainCard 
            header={t('Users')}
            mainLinks={linkMainUsers}
            footerLinks={linkFooterUsers}
          />
          <MainCard 
            header={t('Items')}
            mainLinks={linkMainItems}
            footerLinks={linkFooterItems}
          />
          <MainCard 
            header={t('Menu POS')}
            mainLinks={linkMainMenu}
            footerLinks={linkFooterMenu}
          />
          <MainCard 
            header={t('Pages')}
            mainLinks={linkMainPages}
            footerLinks={linkFooterPages}
          />
          <MainCard 
            header={t('Services, FAQ and Games')}
            mainLinks={linkMainServices}
            footerLinks={linkFooterServices}
          />
          <MainCard 
            header={t('Tasks')}
            mainLinks={linkMainTasks}
            footerLinks={linkFooterTasks}
          />
          <MainCard 
            header={t('Inventory')}
            mainLinks={linkMainInventory}
            footerLinks={linkFooterInventory}
          />
          <MainCard 
            header={t('Setting')}
            mainLinks={linkMainSetting}
            footerLinks={linkFooterSetting}
          />
          <MainCard 
            header={t('VelClient')}
            mainLinks={linkMainVelClient}
            footerLinks={linkFooterVelClient}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default Main
