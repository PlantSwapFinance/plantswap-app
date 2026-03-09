// Unchained Datas

const createUnchainedDatas = (data) => {
  return fetch('/.netlify/functions/unchainedDatas-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllUnchainedDatas = () => {
  return fetch('/.netlify/functions/unchainedDatas-read-all').then((response) => {
    return response.json()
  })
}

const readUnchainedDatasByDataType = (dataType) => {
  const fallbackRead = () =>
    readAllUnchainedDatas().then((all) =>
      Array.isArray(all) ? all.filter((item) => item?.data?.dataType === dataType) : []
    )

  return fetch(`/.netlify/functions/unchainedDatas-read-by-dataType/${dataType}`)
    .then((response) => response.json())
    .then((data) => {
      // Fallback: if read-by-dataType returns empty or error, try read-all and filter
      if (!Array.isArray(data) || data.length === 0) {
        return fallbackRead()
      }
      return data
    })
    .catch(() => fallbackRead())
}

const updateUnchainedDatas = (refId, data) => {
  return fetch(`/.netlify/functions/unchainedDatas-update/${refId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

// Unchained Datas

const createUnchainedLogDatas = (data) => {
  return fetch('/.netlify/functions/unchainedLogDatas-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllUnchainedLogDatas = () => {
  return fetch('/.netlify/functions/unchainedLogDatas-read-all').then((response) => {
    return response.json()
  })
}

const readUnchainedLogDatasByDataType = (userId) => {
  return fetch(`/.netlify/functions/unchainedLogDatas-read-by-dataType/${userId}`).then((response) => {
    return response.json()
  })
}

export default {
  // Unchained Datas
  createUnchainedDatas,
  readAllUnchainedDatas,
  readUnchainedDatasByDataType,
  updateUnchainedDatas,
  // Unchained Log Datas
  createUnchainedLogDatas,
  readAllUnchainedLogDatas,
  readUnchainedLogDatasByDataType
}