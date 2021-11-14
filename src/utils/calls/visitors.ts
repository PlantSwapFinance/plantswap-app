const createVisitors = (data) => {
  return fetch('/.netlify/functions/visitors-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllVisitors = () => {
  return fetch('/.netlify/functions/visitors-read-all').then((response) => {
    return response.json()
  })
}

const readVisitor = (refId) => {
  return fetch(`/.netlify/functions/visitors-read/${refId}`).then((response) => {
    return response.json()
  })
}

const readVisitorByAddress = (userId) => {
  return fetch(`/.netlify/functions/visitors-read-by-address/${userId}`).then((response) => {
    return response.json()
  })
}

export default {
  createVisitors,
  readAllVisitors,
  readVisitor,
  readVisitorByAddress
}