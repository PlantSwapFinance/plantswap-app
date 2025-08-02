import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Grid, Box, Modal, Text, Image, InjectedModalProps, Button, AutoRenewIcon } from '@plantswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from 'contexts/Localization'
import nfts from 'config/constants/nfts'
import useToast from 'hooks/useToast'
import { usePlant, usePointsRewardSchoolNftContract } from 'hooks/useContract'
import { getPointsRewardSchoolNftAddress } from 'utils/addressHelpers'
import { getPlantContract, getPointsRewardSchoolNftContract } from 'utils/contractHelpers'

interface ClaimGiftProps extends InjectedModalProps {
  onSuccess: () => void
}

export const useCanClaim = () => {
  const [canClaim, setCanClaim] = useState(false)
  const [refresh, setRefresh] = useState(1)
  const { address: account } = useAccount()
  const pointsRewardSchoolNftContract = usePointsRewardSchoolNftContract()

  const checkClaimStatus = useCallback(() => {
    setRefresh((prevRefresh) => prevRefresh + 1)
  }, [setRefresh])

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const walletCanClaim = await pointsRewardSchoolNftContract.canClaim(account)
      if(walletCanClaim) {
        setCanClaim(true)
      }
    }
    if (account) {
      fetchClaimStatus()
    }
  }, [account, pointsRewardSchoolNftContract, refresh, setCanClaim])

  return { canClaim, checkClaimStatus }
}
const ClaimGift: React.FC<ClaimGiftProps> = ({ onSuccess, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const { t } = useTranslation()
  const { canClaim } = useCanClaim()
  const plantTokenContract = usePlant()
  const pointsRewardSchoolNftContract = usePointsRewardSchoolNftContract()
  const { address: account } = useAccount()
  const pointsRewardSchoolNftAddress = getPointsRewardSchoolNftAddress()
  const maxNftCost = new BigNumber(1250000000000000000)
  const [nextPointsMinimum, setNextPointsMinimum] = useState(25)
  const [nextGardenerId, setNextGardenerId] = useState(91)
  const [nftCost, setNftCost] = useState(new BigNumber(0))
  const [plantAllowanceRequired, setPlantAllowanceRequired] = useState(true)
  const [plantBalanceRequired, setPlantBalanceRequired] = useState(true)
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const pointsRewardSchoolContract = getPointsRewardSchoolNftContract()
      const userNextChallenge = await pointsRewardSchoolContract.nextPointsToClaim(account)
      const userNextGardenerId = await pointsRewardSchoolContract.nextGardenerId(account)

      setNextPointsMinimum(userNextChallenge.toNumber())
      setNextGardenerId(userNextGardenerId)
      if(userNextGardenerId === 91 || userNextGardenerId === 92) {
        setNftCost(new BigNumber(250000000000000000))
      }
      if(userNextGardenerId === 93 || userNextGardenerId === 94) {
        setNftCost(new BigNumber(500000000000000000))
      }
      if(userNextGardenerId === 95 || userNextGardenerId === 96) {
        setNftCost(new BigNumber(750000000000000000))
      }
      if(userNextGardenerId === 97 || userNextGardenerId === 98) {
        setNftCost(new BigNumber(1000000000000000000))
      }
      if(userNextGardenerId === 99) {
        setNftCost(new BigNumber(1250000000000000000))
      }
    }
    
    if (account) {
      fetchClaimStatus()
    }
  }, [account, setNextPointsMinimum, setNextGardenerId])
  
  useEffect(() => {
    const fetchPlantAllowance = async () => {
      const plantContract = getPlantContract()
      const userPlantAllowance = await plantContract.allowance(account, pointsRewardSchoolNftAddress)
      const userPlantBalance = await plantContract.balanceOf(account)
      const userPlantAllowanceFormated = userPlantAllowance.toJSON()
      const userPlantBalanceFormated = userPlantBalance.toJSON()

      if(userPlantAllowanceFormated >= nftCost)
      {
        setPlantAllowanceRequired(false)
        if(userPlantBalanceFormated >= nftCost)
        {
          setPlantBalanceRequired(false)
        }
      }
    }
    if (account) {
      fetchPlantAllowance()
    }
    
  }, [account, plantTokenContract, pointsRewardSchoolNftAddress, nftCost, setPlantAllowanceRequired, setPlantBalanceRequired])
  
  const handleApprove = async () => {
    setIsApproving(true)
    await plantTokenContract.approve(pointsRewardSchoolNftAddress, maxNftCost.toJSON())
  }

  const handleClick = async () => {
    setIsConfirming(true)
    const response = await pointsRewardSchoolNftContract.mintNFT()
    await response
    if (response) {
      toastSuccess(t('Success!'))
      onSuccess()
      onDismiss()
    } else {
      setIsConfirming(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
    return response
  }
  const pointsRewardGardenersIds = nfts.filter((nft) => nft.variationId && nextGardenerId && nextGardenerId === nft.variationId)
  const nftCostFormated = nftCost.div(1000000000000000000).toFixed(2)

  return (
    <Modal title={t('Claim your Points Reward!')} onDismiss={onDismiss}>
      <div style={{ maxWidth: '640px' }}>
        {pointsRewardGardenersIds.map((nft) => (
          <Grid
          justifyItems="center"
          alignContent="center"
          gridTemplateColumns="1fr 1fr"
          gridColumnGap="16px"
        >
            <Box>
              <Text as="p">{t('Thank you for being a active user of Plantswap!')}</Text>
              <Text as="p" mb="8px">{t('For reaching %nextPointsChallenge% points we wanted to give you a new collectibles.', { nextPointsChallenge: nextPointsMinimum })}</Text>
              <Text as="p" mb="8px">{t('We hope you enjoy and take care of it.')}</Text>
              <Text as="p" mb="24px">{t('Once you claim this NFT, you can use it as profile picture, trade it or placing it in the collectibles farms.')}</Text>
            </Box>
            <Box>
              <Card>
                <CardBody>
                  <Image src={nft.images.ipfs} alt="Plantswap" width={150} height={150} />
                  <Text color="warning">{t('Minting cost: %displayNftCost% PLANT', { displayNftCost: nftCostFormated })}</Text>
                </CardBody>
              </Card>
              {plantAllowanceRequired ? (
                <Button
                  endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
                  isLoading={isConfirming}
                  onClick={handleApprove}
                  disabled={!canClaim}
                >
                  {t('Approve PLANT spending')}
                </Button>
              ) : (
                <Button
                  endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
                  isLoading={isApproving}
                  onClick={handleClick}
                  disabled={!canClaim || plantAllowanceRequired || plantBalanceRequired}
                >
                  {t('Claim Your Collectible')}
                </Button>
              )}
              {plantAllowanceRequired}
              {plantBalanceRequired && (
                <Text color="warning">You need PLANT first before minting this Collectibles.</Text> 
              )}
            </Box>
          </Grid>
        ))}
      </div>
    </Modal>
  )
}

export default ClaimGift
