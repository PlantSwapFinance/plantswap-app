const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `users-read-by-userId` invoked')
  const sql = getClient()
  const userId = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM users WHERE data->>'userId' = ${userId}
    `
    const response = toFaunaFormatArray(result, 'users')
    console.log(`${response.length} users found`)
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
