// User List

const createUsers = (data) => {
  return fetch('/.netlify/functions/users-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllUsers = () => {
  return fetch('/.netlify/functions/users-read-all').then((response) => {
    return response.json()
  })
}

const readUser = (refId) => {
  return fetch(`/.netlify/functions/users-read/${refId}`).then((response) => {
    return response.json()
  })
}

const readUserByUserId = (userId) => {
  return fetch(`/.netlify/functions/users-read-by-userId/${userId}`).then((response) => {
    return response.json()
  })
}

const readUserByUsername = (userId) => {
  return fetch(`/.netlify/functions/users-read-by-username/${userId}`).then((response) => {
    return response.json()
  })
}

const readUserByEmail = (userId) => {
  return fetch(`/.netlify/functions/users-read-by-email/${userId}`).then((response) => {
    return response.json()
  })
}

const readUserByTelephone = (userId) => {
  return fetch(`/.netlify/functions/users-read-by-telephone/${userId}`).then((response) => {
    return response.json()
  })
}

const updateUsers = (refId, data) => {
  return fetch(`/.netlify/functions/users-update/${refId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteUsers = (refId) => {
  return fetch(`/.netlify/functions/users-delete/${refId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

// User Access

const createUsersAccess = (data) => {
  return fetch('/.netlify/functions/users-access-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllUsersAccess = () => {
  return fetch('/.netlify/functions/users-access-read-all').then((response) => {
    return response.json()
  })
}

const readUserAccess = (refId) => {
  return fetch(`/.netlify/functions/users-access-read/${refId}`).then((response) => {
    return response.json()
  })
}

const readUserAccessByUserId = (userId) => {
  return fetch(`/.netlify/functions/users-access-read-by-userId/${userId}`).then((response) => {
    return response.json()
  })
}

const readUserAccessByUserTypeCode = (userId) => {
  return fetch(`/.netlify/functions/users-access-read-by-userTypeCode/${userId}`).then((response) => {
    return response.json()
  })
}

const updateUsersAccess = (refId, data) => {
  return fetch(`/.netlify/functions/users-access-update/${refId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteUsersAccess = (refId) => {
  return fetch(`/.netlify/functions/users-access-delete/${refId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

// User Setting

const createUsersSetting = (data) => {
  return fetch('/.netlify/functions/users-setting-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllUsersSetting = () => {
  return fetch('/.netlify/functions/users-setting-read-all').then((response) => {
    return response.json()
  })
}

const readUserSetting = (refId) => {
  return fetch(`/.netlify/functions/users-setting-read/${refId}`).then((response) => {
    return response.json()
  })
}

const readUserSettingByUserId = (userId) => {
  return fetch(`/.netlify/functions/users-setting-read-by-userId/${userId}`).then((response) => {
    return response.json()
  })
}

const updateUsersSetting = (refId, data) => {
  return fetch(`/.netlify/functions/users-setting-update/${refId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteUsersSetting = (refId) => {
  return fetch(`/.netlify/functions/users-setting-delete/${refId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

// UserTypes

const createUsersType = (data) => {
  return fetch('/.netlify/functions/usersTypes-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAllUsersType = () => {
  return fetch('/.netlify/functions/usersTypes-read-all').then((response) => {
    return response.json()
  })
}

const readUsersType = (refId) => {
  return fetch(`/.netlify/functions/usersTypes-read/${refId}`).then((response) => {
    return response.json()
  })
}

const readUsersTypesByUsersTypeId = (userId) => {
  return fetch(`/.netlify/functions/usersTypes-read-by-userId/${userId}`).then((response) => {
    return response.json()
  })
}

const updateUsersType = (refId, data) => {
  return fetch(`/.netlify/functions/usersTypes-update/${refId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteUsersType = (refId) => {
  return fetch(`/.netlify/functions/usersTypes-delete/${refId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

export default {
  createUsers,
  readAllUsers,
  readUser,
  readUserByUserId,
  readUserByUsername,
  readUserByEmail,
  readUserByTelephone,
  updateUsers,
  deleteUsers,
  // User Access
  createUsersAccess,
  readAllUsersAccess,
  readUserAccess,
  readUserAccessByUserId,
  readUserAccessByUserTypeCode,
  updateUsersAccess,
  deleteUsersAccess,
  // User Setting
  createUsersSetting,
  readAllUsersSetting,
  readUserSetting,
  readUserSettingByUserId,
  updateUsersSetting,
  deleteUsersSetting,
  // UserTypes
  createUsersType,
  readAllUsersType,
  readUsersType,
  readUsersTypesByUsersTypeId,
  updateUsersType,
  deleteUsersType
}