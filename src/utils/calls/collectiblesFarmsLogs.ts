
const createCollectiblesFarmsLogs = (data) => {
    return fetch('/.netlify/functions/collectiblesFarmsLogs-create', {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const readAllCollectiblesFarmsLogs = () => {
    return fetch('/.netlify/functions/collectiblesFarmsLogs-read-all').then((response) => {
      return response.json()
    })
  }
  
  const readCollectiblesFarmsLog = (refId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsLogs-read/${refId}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmsLogByCfId = (cfId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsLogs-read-by-cfid/${cfId}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmsLogByAddress = (address) => {
    return fetch(`/.netlify/functions/collectiblesFarmsLogs-read-by-address/${address}`).then((response) => {
      return response.json()
    })
  }

  const readCollectiblesFarmsLogByCfIdAndAddress = (cfId, address) => {
    return fetch(`/.netlify/functions/collectiblesFarmsLogs-read-by-cfid-and-address/${cfId}/${address}`).then((response) => {
      return response.json()
    })
  }
  
  const updateCollectiblesFarmsLogs = (refId, data) => {
    return fetch(`/.netlify/functions/collectiblesFarmsLogs-update/${refId}`, {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const deleteCollectiblesFarmsLogs = (refId) => {
    return fetch(`/.netlify/functions/collectiblesFarmsLogs-delete/${refId}`, {
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }
  
  export default {
    createCollectiblesFarmsLogs,
    readAllCollectiblesFarmsLogs,
    readCollectiblesFarmsLog,
    readCollectiblesFarmsLogByCfId,
    readCollectiblesFarmsLogByAddress,
    readCollectiblesFarmsLogByCfIdAndAddress,
    updateCollectiblesFarmsLogs,
    deleteCollectiblesFarmsLogs,
  }
  