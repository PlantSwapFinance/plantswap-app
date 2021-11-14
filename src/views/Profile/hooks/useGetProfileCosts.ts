import { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { multicallv2 } from 'utils/multicall'
import profileABI from 'config/abi/plantswapGardenersProfile.json'
import { getPlantProfileAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [costs, setCosts] = useState({
    numberPlantToReactivate: BIG_ZERO,
    numberPlantToRegister: BIG_ZERO,
    numberPlantToUpdate: BIG_ZERO,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const calls = ['numberPlantToReactivate', 'numberPlantToRegister', 'numberPlantToUpdate'].map((method) => ({
          address: getPlantProfileAddress(),
          name: method,
        }))
        const [[numberPlantToReactivate], [numberPlantToRegister], [numberPlantToUpdate]] = await multicallv2(
          profileABI,
          calls,
        )

        setCosts({
          numberPlantToReactivate: new BigNumber(numberPlantToReactivate.toString()),
          numberPlantToRegister: new BigNumber(numberPlantToRegister.toString()),
          numberPlantToUpdate: new BigNumber(numberPlantToUpdate.toString()),
        })
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve PLANT costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t])

  return costs
}

export default useGetProfileCosts
