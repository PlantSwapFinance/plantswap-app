const getPathParams = require('./utils/getPathParams')
const { getClient, formatRows } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `usernames-read-by-userId` invoked')
  const sql = getClient()
  const userId = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM usernames WHERE data->>'userId' = ${userId}
    `
    const response = formatRows(result)
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
