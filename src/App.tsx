import React, { lazy, useState } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import Cookies from 'universal-cookie'
import useEagerConnect from 'hooks/useEagerConnect'
import visitorsApi from 'utils/calls/visitors'
import { useWeb3React } from '@web3-react/core'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import { MASTERGARDENERDEVADDRESS } from 'config'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import MenuDev from './components/MenuDev'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import history from './routerHistory'
// Views included in the main bundle
import VerticalGardens from './views/VerticalGardens'
import Swap from './views/Swap'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Market = lazy(() => import('./views/Market'))
const MarketSellNft = lazy(() => import('./views/Market/sellNft'))
const MarketBuyNft = lazy(() => import('./views/Market/buyNft'))
const MarketCreateAuction = lazy(() => import('./views/Market/createAuction'))
const MarketMakeOffer = lazy(() => import('./views/Market/makeOffer'))
const Gardens = lazy(() => import('./views/Gardens'))
const Foundation = lazy(() => import('./views/Foundation'))
const CollectiblesFarms = lazy(() => import('./views/CollectiblesFarms'))
const FoundationProposal = lazy(() => import('./views/Foundation/Proposal'))
const Donate = lazy(() => import('./views/Foundation/Donate'))
const FoundationCreateProposal = lazy(() => import('./views/Foundation/CreateProposal'))
const Pools = lazy(() => import('./views/Pools'))
const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const Collectibles = lazy(() => import('./views/Collectibles'))
const Teams = lazy(() => import('./views/Teams'))
const Team = lazy(() => import('./views/Teams/Team'))
const Profile = lazy(() => import('./views/Profile'))
const Voting = lazy(() => import('./views/Voting'))
const Proposal = lazy(() => import('./views/Voting/Proposal'))
const CreateProposal = lazy(() => import('./views/Voting/CreateProposal'))

const DevelopmentFund = lazy(() => import('./views/DevelopmentFund'))
const Project = lazy(() => import('./views/Project'))
const Roadmap = lazy(() => import('./views/Roadmap'))
const Tree = lazy(() => import('./views/Tree'))
const Vote = lazy(() => import('./views/Vote'))
const ContactUs = lazy(() => import('./views/ContactUs'))
const Documentation = lazy(() => import('./views/Documentation'))
const PlantArt = lazy(() => import('./views/PlantArt'))

const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const Liquidity = lazy(() => import('./views/Pool'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))
const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))

// DASHBOARD
const Dashboard = lazy(() => import('./views/Dashboard'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const [userId, setUserId] = useState('0x0')
  const [userIdLoaded, setUserIdLoaded] = useState(false)
  const [userIdCreated, setUserIdCreated] = useState(false)
  const cookies = new Cookies()
  const { account } = useWeb3React()
  const [visitorSearched, setVisitorSearched] = useState(false)
  const [visitorExist, setVisitorExist] = useState(false)

  if (userId && userId !== '0x0') {
    cookies.set('userId', userId, { path: '/' })
  }
  else if (!userIdLoaded) {
    const getUserId = cookies.get('userId')
    if (getUserId) {
      setUserId(getUserId)
      setUserIdLoaded(true)
    }
    else if (!userIdLoaded) {
      const localUserId = localStorage.getItem('userId')
      if (localUserId) {
        setUserId(localUserId)
        setUserIdLoaded(true)
      }
      else if (!userIdCreated) {
        setUserId('0x0')
        setUserIdCreated(true)
      }
    }
  }
  
  if (account && !visitorSearched) {
    setVisitorSearched(true)
    visitorsApi.readVisitorByAddress(account).then((usernames)  => {
      if (usernames.length > 0) {
        setVisitorExist(true)
      }
      else {
        const newVisitor = {
          address: account,
          dateAdded: new Date(),
        }
        if (!visitorExist) {
          visitorsApi.createVisitors(newVisitor).then(() => 
            setVisitorExist(true)
          ).catch((err) => {
            console.error(err)
          })
        }
      }
    })
  }

  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {account && account === MASTERGARDENERDEVADDRESS ? (
        <MenuDev>
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/farms">
                <Farms />
              </Route>
            {/* DASHBOARD */}
            <Route path="/dashboard">
              <Dashboard userId={userId} />
            </Route>
              <Route exact path="/market">
                <Market />
              </Route>
              <Route exact path="/market/sellNft">
                <MarketSellNft />
              </Route>
              <Route path="/market/sellNft/:id">
                <MarketSellNft />
              </Route>
              <Route exact path="/market/buyNft">
                <MarketBuyNft />
              </Route>
              <Route path="/market/buyNft/:id">
                <MarketBuyNft />
              </Route>
              <Route exact path="/market/createAuction">
                <MarketCreateAuction />
              </Route>
              <Route path="/market/createAuction/:id">
                <MarketCreateAuction />
              </Route>
              <Route exact path="/market/makeOffer">
                <MarketMakeOffer />
              </Route>
              <Route path="/market/makeOffer/:id">
                <MarketMakeOffer />
              </Route>
              <Route path="/gardens">
                <Gardens tokenMode />
              </Route>
              <Route path="/verticalGardens">
                <VerticalGardens />
              </Route>
              <Route path="/collectiblesFarms">
                <CollectiblesFarms />
              </Route>
              <Route exact path="/foundation">
                <Foundation />
              </Route>
              <Route exact path="/foundation/proposal/create">
                <FoundationCreateProposal />
              </Route>
              <Route exact path="/foundation/donate">
                <Donate />
              </Route>
              <Route path="/foundation/nonprofit/:id">
                <FoundationProposal />
              </Route>
              <Route path="/foundation/proposal/:id">
                <FoundationProposal />
              </Route>
              <Route path="/pools">
                <Pools />
              </Route>
              <Route path="/ifo">
                <Ifos />
              </Route>
              <Route path="/collectibles">
                <Collectibles />
              </Route>
              <Route exact path="/teams">
                <Teams />
              </Route>
              <Route path="/teams/:id">
                <Team />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/developmentFund">
                <DevelopmentFund />
              </Route>
              <Route path="/project">
                <Project />
              </Route>
              <Route path="/roadmap">
                <Roadmap />
              </Route>
              <Route path="/tree">
                <Tree />
              </Route>
              <Route path="/vote">
                <Vote />
              </Route>
              <Route path="/contact-us">
                <ContactUs />
              </Route>
              <Route path="/documentation">
                <Documentation />
              </Route>
              <Route path="/plantArt">
                <PlantArt />
              </Route>

              <Route exact path="/voting">
                <Voting />
              </Route>
              <Route exact path="/voting/proposal/create">
                <CreateProposal />
              </Route>
              <Route path="/voting/proposal/:id">
                <Proposal />
              </Route>

              {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/liquidity" component={Liquidity} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

              {/* Redirect */}
              <Route path="/pool">
                <Redirect to="/liquidity" />
              </Route>
              <Route path="/staking">
                <Redirect to="/pools" />
              </Route>
              <Route path="/syrup">
                <Redirect to="/pools" />
              </Route>
              <Route path="/nft">
                <Redirect to="/collectibles" />
              </Route>

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
        </MenuDev>
      ) : (
        <Menu>
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/farms">
                <Farms />
              </Route>
              <Route path="/gardens">
                <Gardens tokenMode />
              </Route>
              <Route path="/verticalGardens">
                <VerticalGardens />
              </Route>
              <Route path="/collectiblesFarms">
                <CollectiblesFarms />
              </Route>
              <Route exact path="/foundation">
                <Foundation />
              </Route>
              <Route exact path="/foundation/proposal/create">
                <FoundationCreateProposal />
              </Route>
              <Route exact path="/foundation/donate">
                <Donate />
              </Route>
              <Route path="/foundation/nonprofit/:id">
                <FoundationProposal />
              </Route>
              <Route path="/foundation/proposal/:id">
                <FoundationProposal />
              </Route>
              <Route path="/pools">
                <Pools />
              </Route>
              <Route path="/collectibles">
                <Collectibles />
              </Route>
              <Route exact path="/teams">
                <Teams />
              </Route>
              <Route path="/teams/:id">
                <Team />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/developmentFund">
                <DevelopmentFund />
              </Route>
              <Route path="/project">
                <Project />
              </Route>
              <Route path="/roadmap">
                <Roadmap />
              </Route>
              <Route path="/tree">
                <Tree />
              </Route>
              <Route path="/vote">
                <Vote />
              </Route>
              <Route path="/documentation">
                <Documentation />
              </Route>

              {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/liquidity" component={Liquidity} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

              {/* Redirect */}
              <Route path="/pool">
                <Redirect to="/liquidity" />
              </Route>
              <Route path="/staking">
                <Redirect to="/pools" />
              </Route>
              <Route path="/syrup">
                <Redirect to="/pools" />
              </Route>
              <Route path="/nft">
                <Redirect to="/collectibles" />
              </Route>

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
        </Menu>
      )}
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
