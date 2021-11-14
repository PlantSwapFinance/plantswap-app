
const createUsernames = (data) => {
    return fetch('/.netlify/functions/usernames-create', {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const readAllUsernames = () => {
    return fetch('/.netlify/functions/usernames-read-all').then((response) => {
      return response.json()
    })
  }
  
  const readUsername = (refId) => {
    return fetch(`/.netlify/functions/usernames-read/${refId}`).then((response) => {
      return response.json()
    })
  }

  const readUsernameByUserId = (userId) => {
    return fetch(`/.netlify/functions/usernames-read-by-userId/${userId}`).then((response) => {
      return response.json()
    })
  }
  
  const updateUsernames = (refId, data) => {
    return fetch(`/.netlify/functions/usernames-update/${refId}`, {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  }
  
  const deleteUsernames = (refId) => {
    return fetch(`/.netlify/functions/usernames-delete/${refId}`, {
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }
  
  export default {
    createUsernames,
    readAllUsernames,
    readUsername,
    readUsernameByUserId,
    updateUsernames,
    deleteUsernames,
  }
  