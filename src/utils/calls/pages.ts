// Page List

const createPages = (data) => {
  return fetch('/.netlify/functions/pages-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllPages = () => {
  return fetch('/.netlify/functions/pages-read-all').then((response) => {
    return response.json()
  })
}

const readPage = (refId) => {
  return fetch(`/.netlify/functions/pages-read/${refId}`).then((response) => {
    return response.json()
  })
}

const readPageByPageId = (pageId) => {
  return fetch(`/.netlify/functions/pages-read-by-pageId/${pageId}`).then((response) => {
    return response.json()
  })
}

const updatePages = (refId, data) => {
  return fetch(`/.netlify/functions/pages-update/${refId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deletePages = (refId) => {
  return fetch(`/.netlify/functions/pages-delete/${refId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

// Page Access

const createPagesAccess = (data) => {
  return fetch('/.netlify/functions/users-access-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllPagesAccess = () => {
  return fetch('/.netlify/functions/users-access-read-all').then((response) => {
    return response.json()
  })
}

const readPageAccess = (userId) => {
  return fetch(`/.netlify/functions/users-access-read/${userId}`).then((response) => {
    return response.json()
  })
}

const readPageAccessByPageId = (userId) => {
  return fetch(`/.netlify/functions/users-access-read-by-userId/${userId}`).then((response) => {
    return response.json()
  })
}

const updatePagesAccess = (userId, data) => {
  return fetch(`/.netlify/functions/users-access-update/${userId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deletePagesAccess = (userId) => {
  return fetch(`/.netlify/functions/users-access-delete/${userId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

export default {
  createPages,
  readAllPages,
  readPage,
  readPageByPageId,
  updatePages,
  deletePages,
  // Page Access
  createPagesAccess,
  readAllPagesAccess,
  readPageAccess,
  readPageAccessByPageId,
  updatePagesAccess,
  deletePagesAccess
}
  