import { DEFAULT_GAS_LIMIT } from 'config'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const addTransaction = async (plantswapMarketContract, sellType, sellTypeValue, 
  buyNftElseToken, buyTokenAddress, buyTokenId, buyCount, 
  sellNftElseToken, sellTokenAddress, sellTokenId, sellCount, isActive) => {

  const tx = await plantswapMarketContract.addTransaction(sellType, sellTypeValue, 
    sellTypeValue, buyTokenAddress, buyTokenId, buyCount, 
    sellNftElseToken, sellTokenAddress, sellTokenId, sellCount, isActive, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const modifyTransaction = async (plantswapMarketContract, listingId, copyListingId, newSellType) => {

  const tx = await plantswapMarketContract.modifyTransaction(listingId, copyListingId, newSellType, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const cancelTransaction = async (plantswapMarketContract, listingId) => {

  const tx = await plantswapMarketContract.cancelTransaction(listingId, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const claimTransaction = async (plantswapMarketContract, listingId) => {

  const tx = await plantswapMarketContract.claimTransaction(listingId, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const closeTransaction = async (plantswapMarketContract, listingId, extraValue) => {

  const tx = await plantswapMarketContract.closeTransaction(listingId, extraValue, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const freezeTransaction = async (plantswapMarketContract, listingId,) => {

  const tx = await plantswapMarketContract.freezeTransaction(listingId, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const activateTransaction = async (plantswapMarketContract, listingId) => {

  const tx = await plantswapMarketContract.activateTransaction(listingId, options)
  const receipt = await tx.wait()
  return receipt.status
}
