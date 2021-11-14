import React, { createContext, useEffect, useMemo, useReducer } from 'react'
import { useWeb3React } from '@web3-react/core'

export type Actions =
  { type: 'set_selected_nft'; nftAddress: string; tokenId: number }
  | { type: 'initialize'; step: number }

export interface State {
  isInitialized: boolean
  selectedNft: {
    tokenId: number
    nftAddress: string
  }
}

export interface ContextType extends State {
  actions: {
    setSelectedNft: (tokenId: number, nftAddress: string) => void
  }
}

const initialState: State = {
  isInitialized: false,
  selectedNft: {
    nftAddress: null,
    tokenId: null,
  },
}


const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        isInitialized: true,
      }
    case 'set_selected_nft':
      return {
        ...state,
        selectedNft: {
          tokenId: action.tokenId,
          nftAddress: action.nftAddress,
        },
      }
    default:
      return state
  }
}

export const NftSelectionContext = createContext<ContextType>(null)

const NftSelectionProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account } = useWeb3React()

  // Initial checks
  useEffect(() => {
    let isSubscribed = true

    const fetchData = async () => {
      dispatch({ type: 'initialize', step: 1 })

      // When changing wallets quickly unmounting before the hasClaim finished causes a React error
      if (isSubscribed) {
        dispatch({ type: 'initialize', step: 1 })
      }
    }

    if (account) {
      fetchData()
    }

    return () => {
      isSubscribed = false
    }
  }, [account, dispatch])

  const actions: ContextType['actions'] = useMemo(
    () => ({
      setSelectedNft: (tokenId: number, nftAddress: string) =>
        dispatch({ type: 'set_selected_nft', tokenId, nftAddress }),
    }),
    [dispatch],
  )

  return <NftSelectionContext.Provider value={{ ...state, actions }}>{children}</NftSelectionContext.Provider>
}

export default NftSelectionProvider
