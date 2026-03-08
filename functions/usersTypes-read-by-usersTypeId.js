const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `usersTypes-read-by-usersTypeId` invoked')
  const sql = getClient()
  const usersTypeId = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM users_types WHERE data->>'usersTypeId' = ${usersTypeId}
    `
    const response = toFaunaFormatArray(result, 'usersTypes')
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
