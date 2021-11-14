import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Heading, Text } from '@plantswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { usePlant, useGardeningSchoolNftContract } from 'hooks/useContract'
import { Nft } from 'config/constants/types'
import useHasPlantBalance from 'hooks/useHasPlantBalance'
import nftList from 'config/constants/nfts'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import ApproveConfirmButtons from '../components/ApproveConfirmButtons'
import useProfileCreation from './contexts/hook'
import { MINT_COST, STARTER_BUNNY_IDENTIFIERS } from './config'

const nfts = nftList.filter((nft) => STARTER_BUNNY_IDENTIFIERS.includes(nft.identifier))
const minimumPlantBalanceToMint = new BigNumber(MINT_COST).multipliedBy(DEFAULT_TOKEN_DECIMAL)

const Mint: React.FC = () => {
  const [variationId, setVariationId] = useState<Nft['variationId']>(null)
  const { actions, minimumPlantRequired, allowance } = useProfileCreation()

  const { account } = useWeb3React()
  const plantContract = usePlant()
  const gardeningSchoolContract = useGardeningSchoolNftContract()
  const { t } = useTranslation()
  const hasMinimumPlantRequired = useHasPlantBalance(minimumPlantBalanceToMint)
  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        // TODO: Move this to a helper, this check will be probably be used many times
        try {
          const response = await plantContract.allowance(account, gardeningSchoolContract.address)
          const currentAllowance = new BigNumber(response.toString())
          return currentAllowance.gte(minimumPlantRequired)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return plantContract.approve(gardeningSchoolContract.address, allowance.toJSON())
      },
      onConfirm: () => {
        return gardeningSchoolContract.mintGardener(variationId)
      },
      onSuccess: () => actions.nextStep(),
    })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Get Starter Collectible')}
      </Heading>
      <Text as="p">{t('Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{t('This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {t('You can change your profile pic later if you get another approved Plant Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {t('Cost: %num% PLANT', { num: MINT_COST })}
          </Text>
          {nfts.map((nft) => {
            const handleChange = (value: string) => setVariationId(Number(value))

            return (
              <SelectionCard
                key={nft.identifier}
                name="mintStarter"
                value={nft.variationId}
                image={`/images/nfts/${nft.images.md}`}
                isChecked={variationId === nft.variationId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumPlantRequired}
              >
                <Text bold>{nft.name}</Text>
              </SelectionCard>
            )
          })}
          {!hasMinimumPlantRequired && (
            <Text color="failure" mb="16px">
              {t('A minimum of %num% PLANT is required', { num: MINT_COST })}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={variationId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumPlantRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
