import React, { useState } from 'react'
import styled from 'styled-components'
// import BigNumber from 'bignumber.js'
import { Modal, Text, Button, AutoRenewIcon, Link, Skeleton, ModalBody } from '@plantswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Nfts from 'config/constants/nfts'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import collectiblesFarmsLogsApi from 'utils/calls/collectiblesFarmsLogs'
import collectiblesFarmsBagsApi from 'utils/calls/collectiblesFarmsBags'
import { useGetCollectibles } from 'state/hooks'
import { CollectiblesFarm } from 'state/types'
// import { fetchUserTokens } from 'state/collectiblesFarms/fetchCollectiblesFarmsUser'
// import { getNftByTokenId } from 'utils/collectibles'
import { useWeb3React } from '@web3-react/core'
import { getAddress } from 'utils/addressHelpers'
import { usePlantswapGardeners } from 'hooks/useContract'
import SelectionCard from './SelectionCard'
import useStakeCollectiblesFarm from '../../../hooks/useStakeCollectiblesFarm'
import useUnstakeCollectiblesFarm from '../../../hooks/useUnstakeCollectiblesFarm'

interface StakeModalProps {
  collectiblesFarm: CollectiblesFarm
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const NftWrapper = styled.div`
  margin-bottom: 12px;
  padding-left: 6px;
`

interface NftStaked {
  tokenId: number
  variationId: number
}

const StakeModal: React.FC<StakeModalProps> = ({
  collectiblesFarm,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { cfId, variantIdStart, variantIdEnd, stakingRewardToken, collectiblesFarmingPoolContract
    // , userData
 } = collectiblesFarm
  const { t } = useTranslation()
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [selectedNftTokenId, setSelectedNftTokenId] = useState<number>()
  const [variationId, setvariationId] = useState<number>()
  const { isLoading, nftsInWallet, tokenIds } = useGetCollectibles()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { onStake } = useStakeCollectiblesFarm(cfId)
  const { onUnstake } = useUnstakeCollectiblesFarm(cfId)
  const plantswapGardenersContract = usePlantswapGardeners()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  // eslint-disable-next-line
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakedToken, setStakedToken] = useState<NftStaked[]>([])
  const [stakedTokenLoaded, setStakedTokenLoaded] = useState(false)
  const [stakedTokenCreated, setStakedTokenCreated] = useState(false)
  
  // const logUserCollectibles = new BigNumber(userData.collectiblesUse) || new BigNumber(0)
  // const logUserCollectiblesNum = logUserCollectibles.toNumber()

  // const tokenInfo = async (id) => getNftByTokenId('0xA7C25c199BC8Dd06c4Edd2Ea8aEbCeC40A404c03', id)
  // const identifiers = Object.values(userData.userTokens.nft)

  const handleApprove = async () => {


    collectiblesFarmsBagsApi.createCollectiblesFarmsBags({
      cfId: collectiblesFarm.cfId.toString(),
      address: account,
      tokenId: selectedNftTokenId.toString(),
      variationId: variationId.toString(),
      isApproving: true,
      approveDate: new Date(),
    })
    if (!stakedTokenCreated) {
      collectiblesFarmsLogsApi.readCollectiblesFarmsLogByAddress(account).then((userFarmCollectibles) => {
        if (userFarmCollectibles.length === 0) {
          const newUserFarmCollectibles = {
            cfId: collectiblesFarm.cfId.toString(),
            address: account,
            tokenId: selectedNftTokenId.toString(),
            variationId: variationId.toString(),
            isApproving: true,
            approveDate: new Date(),
          }
          collectiblesFarmsLogsApi.createCollectiblesFarmsLogs(newUserFarmCollectibles)
        }
      })
      setStakedTokenCreated(true)
    }

    const tx = await plantswapGardenersContract.approve(getAddress(collectiblesFarmingPoolContract), selectedNftTokenId)
    setIsApproving(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      setIsApproving(false)
      setIsApproved(true)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsApproving(false)
    }
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isRemovingStake) {
      // unstaking
      try {
        await onUnstake(selectedNftTokenId)

        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: stakingRewardToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()

        collectiblesFarmsBagsApi.readCollectiblesFarmsBagByTokenId(selectedNftTokenId).then((bags) => {
          if (bags.length > 0) {
            collectiblesFarmsBagsApi.deleteCollectiblesFarmsBags(bags[0].ref["@ref"].id)
          }
        }) 
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    } else {
      try {
        // staking
        await onStake(selectedNftTokenId)
        
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% funds have been staked in the vertical Garden!', {
            symbol: "Nft",
          }),
        )
        setPendingTx(false)
        onDismiss()

        collectiblesFarmsBagsApi.createCollectiblesFarmsBags({
          cfId: collectiblesFarm.cfId.toString(),
          address: account,
          tokenId: selectedNftTokenId.toString(),
          variationId: variationId.toString(),
          isApproving: true,
          approveDate: new Date(),
        })
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setPendingTx(false)
      }
    }
  }

  if (!stakedTokenLoaded) {
    collectiblesFarmsBagsApi.readCollectiblesFarmsBagByAddress(account).then((userFarmCollectibles) => {
      if (userFarmCollectibles.length > 0) {
        const buildTokenStaked = []
        userFarmCollectibles.map((userFarmCollectible) => {
          if (parseInt(userFarmCollectible.data.cfId, 10) === collectiblesFarm.cfId) {
            buildTokenStaked.push({
              tokenId: parseInt(userFarmCollectible.data.tokenId, 10),
              variationId: parseInt(userFarmCollectible.data.variationId, 10),
            })
          }
          return null
        })
        setStakedToken(buildTokenStaked)
      }
    })
    setStakedTokenLoaded(true)
  }

  return (
    <Modal
      title={isRemovingStake ? t('Unstake your collectibles') : t('Stake Nft in Collectibles Farm')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.newTrees}
    >
      <ModalBody>
        {!isRemovingStake ? (
          <>
            <Text as="p" color="textSubtle">
              {t('Choose collectibles (NFT) in your wallet, that is accepted in this collectibles farm.')}
            </Text>
            <NftWrapper>
              {isLoading ? (
                <Skeleton height="80px" mb="16px" />
              ) : (
                nftsInWallet.map((walletNft) => {
                  const [firstTokenId] = tokenIds[walletNft.identifier]

                  if(!variantIdEnd || variantIdEnd < 1 || (walletNft.variationId > variantIdStart && walletNft.variationId <= variantIdEnd)) {
                      return (
                        <SelectionCard
                          name="collectiblesFarmStaking"
                          key={walletNft.identifier}
                          value={firstTokenId}
                          image={`/images/nfts/${walletNft.images.md}`}
                          isChecked={firstTokenId === selectedNftTokenId}
                          onChange={(value: string) => { 
                            setSelectedNftTokenId(parseInt(value, 10))
                            setvariationId(walletNft.variationId)
                          }}
                        >
                          <Text bold>{walletNft.name}</Text>
                        </SelectionCard>
                      )
                  }
                  return null
                  })
              )}
            </NftWrapper>
            <Text as="p" color="textSubtle" mb="16px">
              {t(
                "The collectible you've chosen will be locked in a smart contract while it will generate PLANT token for you. Don't worry - you'll be able to get it back at any time.",
              )}
            </Text>
            <Button
              isLoading={isApproving}
              disabled={isApproved || isApproving || selectedNftTokenId === null}
              onClick={handleApprove}
              endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              id="approveStarterCollectible"
            >
              {t('Enable')}
            </Button>

            <Button
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              onClick={handleConfirmClick}
              disabled={!isApproved || isApproving || selectedNftTokenId === null}
              mt="24px"
            >
              {pendingTx ? t('Confirming') : t('Confirm')}
            </Button>
            {!isRemovingStake && (
              <StyledLink external href="/collectibles">
                <Button width="100%" mt="8px" variant="secondary">
                  {t('Get more collectibles')}
                </Button>
              </StyledLink>
            )}
            </>
          ) : (
            <>
              <Text as="p" color="textSubtle">
                {t('Choose collectibles (NFT) to unstake.')}
              </Text>
              <NftWrapper> 
                {Nfts.length > 0 && (
                  <>
                  {/* Map and filter nft with stakedToken  */}
                    {Nfts.map((nft) => {
                      if (stakedToken.length > 0) {
                        if (stakedToken.find((staked) => staked.variationId === nft.variationId)) {
                          const { tokenId } = stakedToken.find((staked) => staked.variationId === nft.variationId)
                          return (
                            <SelectionCard
                              name="collectiblesFarmStaking"
                              key={nft.identifier}
                              value={tokenId}
                              image={`/images/nfts/${nft.images.md}`}
                              isChecked={tokenId === selectedNftTokenId}
                              onChange={(value: string) => setSelectedNftTokenId(parseInt(value, 10))}
                            >
                              <Text bold>{nft.name}</Text>
                            </SelectionCard>
                          )
                        }
                      }
                      return null
                    })}
                  </>
                )}
              </NftWrapper>
  
              <Button
                isLoading={pendingTx}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleConfirmClick}
                disabled={selectedNftTokenId === 0}
                mt="24px"
              >
                {pendingTx ? t('Confirming') : t('Confirm')}
              </Button>
              {!isRemovingStake && (
                <StyledLink external href="/collectibles">
                  <Button width="100%" mt="8px" variant="secondary">
                    {t('Get more collectibles')}
                  </Button>
                </StyledLink>
              )}
              </>
            )}
      </ModalBody>
    </Modal>
  )
}

export default StakeModal
