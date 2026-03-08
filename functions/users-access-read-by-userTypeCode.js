const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `users-access-read-by-userTypeCode` invoked')
  const sql = getClient()
  const userTypeCode = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM users_access WHERE data->>'userTypeCode' = ${userTypeCode}
    `
    const response = toFaunaFormatArray(result, 'users_access')
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    }
  }
}
