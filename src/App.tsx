import React, { lazy, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ResetCSS } from '@plantswap/uikit'
import BigNumber from 'bignumber.js'
import Cookies from 'js-cookie'
import useEagerConnect from 'hooks/useEagerConnect'
import visitorsApi from 'utils/calls/visitors'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import { MASTERGARDENERDEVADDRESS } from 'config'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import MenuDev from './components/MenuDev'
import PageMeta from './components/Layout/PageMeta'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
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
import useActiveWeb3React from './hooks/useActiveWeb3React'

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
  const { account } = useActiveWeb3React()
  const [visitorExist, setVisitorExist] = useState(false)
  const visitorSearchedRef = useRef(false)

  if (userId && userId !== '0x0') {
    Cookies.set('userId', userId, { path: '/' })
  } else if (!userIdLoaded) {
    const getUserId = Cookies.get('userId')
    if (getUserId) {
      setUserId(getUserId)
      setUserIdLoaded(true)
    } else if (!userIdLoaded) {
      const localUserId = localStorage.getItem('userId')
      if (localUserId) {
        setUserId(localUserId)
        setUserIdLoaded(true)
      } else if (!userIdCreated) {
        setUserId('0x0')
        setUserIdCreated(true)
      }
    }
  }

  // Visitor lookup runs after `account` changes. Side effects (network calls)
  // must not run in the render body — StrictMode would double-fire them and
  // any re-render before the response resolves would queue an extra request.
  // The ref guards against re-firing across re-renders without triggering one.
  useEffect(() => {
    if (!account || visitorSearchedRef.current) return
    visitorSearchedRef.current = true
    visitorsApi.readVisitorByAddress(account).then((usernames) => {
      if (usernames.length > 0) {
        setVisitorExist(true)
      } else {
        const newVisitor = {
          address: account,
          dateAdded: new Date(),
        }
        if (!visitorExist) {
          visitorsApi
            .createVisitors(newVisitor)
            .then(() => setVisitorExist(true))
            .catch((err) => {
              console.error(err)
            })
        }
      }
    })
    // visitorExist is read from a stale closure intentionally — the original
    // logic gated duplicate visitor creation within a single fetch cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()

  return (
    <>
      <PageMeta />
      <ResetCSS />
      <GlobalStyle />
      {account && account === MASTERGARDENERDEVADDRESS ? (
        <MenuDev>
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/farms/*" element={<Farms />} />
              {/* DASHBOARD */}
              <Route path="/dashboard/*" element={<Dashboard userId={userId} />} />
              <Route path="/market/*" element={<Market />} />
              <Route path="/market/sellNft" element={<MarketSellNft />} />
              <Route path="/market/sellNft/:id" element={<MarketSellNft />} />
              <Route path="/market/buyNft" element={<MarketBuyNft />} />
              <Route path="/market/buyNft/:id" element={<MarketBuyNft />} />
              <Route path="/market/createAuction" element={<MarketCreateAuction />} />
              <Route path="/market/createAuction/:id" element={<MarketCreateAuction />} />
              <Route path="/market/makeOffer" element={<MarketMakeOffer />} />
              <Route path="/market/makeOffer/:id" element={<MarketMakeOffer />} />
              <Route path="/gardens/*" element={<Gardens tokenMode />} />
              <Route path="/verticalGardens/*" element={<VerticalGardens />} />
              <Route path="/collectiblesFarms/*" element={<CollectiblesFarms />} />
              <Route path="/foundation" element={<Foundation />} />
              <Route path="/foundation/proposal/create" element={<FoundationCreateProposal />} />
              <Route path="/foundation/donate" element={<Donate />} />
              <Route path="/foundation/nonprofit/:id" element={<FoundationProposal />} />
              <Route path="/foundation/proposal/:id" element={<FoundationProposal />} />
              <Route path="/pools/*" element={<Pools />} />
              <Route path="/collectibles/*" element={<Collectibles />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<Team />} />
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/developmentFund" element={<DevelopmentFund />} />
              <Route path="/project" element={<Project />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/tree" element={<Tree />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/documentation" element={<Documentation />} />

              <Route path="/voting" element={<Voting />} />
              <Route path="/voting/proposal/create" element={<CreateProposal />} />
              <Route path="/voting/proposal/:id" element={<Proposal />} />

              {/* These components read their route params/navigation via hooks */}
              <Route path="/swap" element={<Swap />} />
              <Route path="/swap/:outputCurrency" element={<RedirectToSwap />} />
              <Route path="/send" element={<RedirectPathToSwapOnly />} />
              <Route path="/find" element={<PoolFinder />} />
              <Route path="/liquidity" element={<Liquidity />} />
              <Route path="/create" element={<RedirectToAddLiquidity />} />
              <Route path="/add" element={<AddLiquidity />} />
              <Route path="/add/:currencyIdA" element={<RedirectOldAddLiquidityPathStructure />} />
              <Route path="/add/:currencyIdA/:currencyIdB" element={<RedirectDuplicateTokenIds />} />
              <Route path="/create/:currencyIdA" element={<RedirectOldAddLiquidityPathStructure />} />
              <Route path="/create/:currencyIdA/:currencyIdB" element={<RedirectDuplicateTokenIds />} />
              <Route path="/remove/:tokens" element={<RedirectOldRemoveLiquidityPathStructure />} />
              <Route path="/remove/:currencyIdA/:currencyIdB" element={<RemoveLiquidity />} />

              {/* Redirect */}
              <Route path="/pool" element={<Navigate to="/liquidity" replace />} />
              <Route path="/staking" element={<Navigate to="/pools" replace />} />
              <Route path="/syrup" element={<Navigate to="/pools" replace />} />
              <Route path="/nft" element={<Navigate to="/collectibles" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SuspenseWithChunkError>
        </MenuDev>
      ) : (
        <Menu>
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/farms/*" element={<Farms />} />
              <Route path="/gardens/*" element={<Gardens tokenMode />} />
              <Route path="/verticalGardens/*" element={<VerticalGardens />} />
              <Route path="/collectiblesFarms/*" element={<CollectiblesFarms />} />
              <Route path="/foundation" element={<Foundation />} />
              <Route path="/foundation/proposal/create" element={<FoundationCreateProposal />} />
              <Route path="/foundation/donate" element={<Donate />} />
              <Route path="/foundation/nonprofit/:id" element={<FoundationProposal />} />
              <Route path="/foundation/proposal/:id" element={<FoundationProposal />} />
              <Route path="/pools/*" element={<Pools />} />
              <Route path="/collectibles/*" element={<Collectibles />} />
              <Route path="/market/*" element={<Market />} />
              <Route path="/market/sellNft" element={<MarketSellNft />} />
              <Route path="/market/sellNft/:id" element={<MarketSellNft />} />
              <Route path="/market/buyNft" element={<MarketBuyNft />} />
              <Route path="/market/buyNft/:id" element={<MarketBuyNft />} />
              <Route path="/market/createAuction" element={<MarketCreateAuction />} />
              <Route path="/market/createAuction/:id" element={<MarketCreateAuction />} />
              <Route path="/market/makeOffer" element={<MarketMakeOffer />} />
              <Route path="/market/makeOffer/:id" element={<MarketMakeOffer />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<Team />} />
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/developmentFund" element={<DevelopmentFund />} />
              <Route path="/project" element={<Project />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/tree" element={<Tree />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/documentation" element={<Documentation />} />

              {/* These components read their route params/navigation via hooks */}
              <Route path="/swap" element={<Swap />} />
              <Route path="/swap/:outputCurrency" element={<RedirectToSwap />} />
              <Route path="/send" element={<RedirectPathToSwapOnly />} />
              <Route path="/find" element={<PoolFinder />} />
              <Route path="/liquidity" element={<Liquidity />} />
              <Route path="/create" element={<RedirectToAddLiquidity />} />
              <Route path="/add" element={<AddLiquidity />} />
              <Route path="/add/:currencyIdA" element={<RedirectOldAddLiquidityPathStructure />} />
              <Route path="/add/:currencyIdA/:currencyIdB" element={<RedirectDuplicateTokenIds />} />
              <Route path="/create/:currencyIdA" element={<RedirectOldAddLiquidityPathStructure />} />
              <Route path="/create/:currencyIdA/:currencyIdB" element={<RedirectDuplicateTokenIds />} />
              <Route path="/remove/:tokens" element={<RedirectOldRemoveLiquidityPathStructure />} />
              <Route path="/remove/:currencyIdA/:currencyIdB" element={<RemoveLiquidity />} />

              {/* Redirect */}
              <Route path="/pool" element={<Navigate to="/liquidity" replace />} />
              <Route path="/staking" element={<Navigate to="/pools" replace />} />
              <Route path="/syrup" element={<Navigate to="/pools" replace />} />
              <Route path="/nft" element={<Navigate to="/collectibles" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SuspenseWithChunkError>
        </Menu>
      )}
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </>
  )
}

export default React.memo(App)
