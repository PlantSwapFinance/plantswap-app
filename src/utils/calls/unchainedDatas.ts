// Unchained Datas
//
// The functions below call Netlify Functions endpoints under `/.netlify/functions/*`.
// In dev these endpoints don't exist (the Netlify dev runtime isn't running), so every
// fetch returns a 404 HTML page and `response.json()` throws
// "Unexpected token <, <!DOCTYPE ... is not valid JSON" or
// "Unexpected end of JSON input". We swallow non-OK responses and return
// sensible empty defaults so the rest of the app keeps working.

const safeJson = (response, fallback) => {
  if (!response.ok) return Promise.resolve(fallback)
  return response.text().then((text) => {
    if (!text) return fallback
    try {
      return JSON.parse(text)
    } catch {
      return fallback
    }
  })
}

const createUnchainedDatas = (data) => {
  return fetch('/.netlify/functions/unchainedDatas-create', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => safeJson(response, null)).catch(() => null)
}

const readAllUnchainedDatas = () => {
  return fetch('/.netlify/functions/unchainedDatas-read-all')
    .then((response) => safeJson(response, []))
    .catch(() => [])
}

const readUnchainedDatasByDataType = (dataType) => {
  const fallbackRead = () =>
    readAllUnchainedDatas().then((all) =>
      Array.isArray(all) ? all.filter((item) => item?.data?.dataType === dataType) : []
    )

  return fetch(`/.netlify/functions/unchainedDatas-read-by-dataType/${dataType}`)
    .then((response) => safeJson(response, []))
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
    method: 'POST',
  })
    .then((response) => safeJson(response, null))
    .catch(() => null)
}

// Unchained Log Datas

const createUnchainedLogDatas = (data) => {
  return fetch('/.netlify/functions/unchainedLogDatas-create', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => safeJson(response, null)).catch(() => null)
}

const readAllUnchainedLogDatas = () => {
  return fetch('/.netlify/functions/unchainedLogDatas-read-all')
    .then((response) => safeJson(response, []))
    .catch(() => [])
}

const readUnchainedLogDatasByDataType = (userId) => {
  return fetch(`/.netlify/functions/unchainedLogDatas-read-by-dataType/${userId}`)
    .then((response) => safeJson(response, []))
    .catch(() => [])
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
  readUnchainedLogDatasByDataType,
}