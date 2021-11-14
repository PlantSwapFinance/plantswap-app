
const createCollectiblesFarmsBags = (data) => {
    return fetch('/.netlify/functions/collectiblesFarmsBags-create', {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const readAllCollectiblesFarmsBags = () => {
    return fetch('/.netlify/functions/collectiblesFarmsBags-read-all').then((response) => {
      return response.json()
    })
  }
  
  const readCollectiblesFarmsBag = (refId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsBags-read/${refId}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmsBagByCfId = (cfId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsBags-read-by-cfid/${cfId}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmsBagByTokenId = (cfId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsBags-read-by-tokenId/${cfId}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmsBagByAddress = (address) => {
    return fetch(`/.netlify/functions/collectiblesFarmsBags-read-by-address/${address}`).then((response) => {
      return response.json()
    })
  }
  
  const updateCollectiblesFarmsBags = (refId, data) => {
    return fetch(`/.netlify/functions/collectiblesFarmsBags-update/${refId}`, {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const deleteCollectiblesFarmsBags = (refId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsBags-delete/${refId}`, {
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }
  
  export default {
    createCollectiblesFarmsBags,
    readAllCollectiblesFarmsBags,
    readCollectiblesFarmsBag,
    readCollectiblesFarmsBagByCfId,
    readCollectiblesFarmsBagByTokenId,
    readCollectiblesFarmsBagByAddress,
    updateCollectiblesFarmsBags,
    deleteCollectiblesFarmsBags,
  }
  