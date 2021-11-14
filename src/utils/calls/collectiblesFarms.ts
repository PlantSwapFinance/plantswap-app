
const createCollectiblesFarms = (data) => {
    return fetch('/.netlify/functions/collectiblesFarms-create', {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const readAllCollectiblesFarms = () => {
    return fetch('/.netlify/functions/collectiblesFarms-read-all').then((response) => {
      return response.json()
    })
  }
  
  const readCollectiblesFarm = (refId) => {
    return fetch(`/.netlify/functions/collectiblesFarms-read/${refId}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmByCfId = (cfId) => {
    return fetch(`/.netlify/functions/collectiblesFarms-read-by-cfid/${cfId}`).then((response) => {
      return response.json()
    })
  }
  
  const updateCollectiblesFarms = (refId, data) => {
    return fetch(`/.netlify/functions/collectiblesFarms-update/${refId}`, {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const deleteCollectiblesFarms = (refId) => {
    return fetch(`/.netlify/functions/collectiblesFarms-delete/${refId}`, {
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }
  
  export default {
    createCollectiblesFarms,
    readAllCollectiblesFarms,
    readCollectiblesFarm,
    readCollectiblesFarmByCfId,
    updateCollectiblesFarms,
    deleteCollectiblesFarms,
  }
  