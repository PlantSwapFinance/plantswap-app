const getPathParams = require('./utils/getPathParams')
const { getClient, formatRows } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `users-read-by-telephone` invoked')
  const sql = getClient()
  const telephone = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM users WHERE data->>'telephone' = ${telephone}
    `
    const response = formatRows(result)
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
