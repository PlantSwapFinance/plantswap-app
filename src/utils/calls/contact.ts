const submitContact = (data) => {
  return fetch('/.netlify/functions/contact-us', {
    body: JSON.stringify(data),
    method: 'POST',
  }).then((response) => {
    return response.json()
  })
}

export default {
  submitContact,
}