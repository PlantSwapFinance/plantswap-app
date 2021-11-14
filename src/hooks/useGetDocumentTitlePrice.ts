import { useEffect } from 'react'
import { usePlantBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const plantPriceBusd = usePlantBusdPrice()
  useEffect(() => {
    const plantPriceBusdString = plantPriceBusd ? plantPriceBusd.toFixed(2) : ''
    document.title = `Plant Swap - ${plantPriceBusdString}`
  }, [plantPriceBusd])
}
export default useGetDocumentTitlePrice
