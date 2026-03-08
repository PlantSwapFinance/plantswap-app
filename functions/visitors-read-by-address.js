const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `visitors-read-by-address` invoked')
  const sql = getClient()
  const address = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM visitors WHERE data->>'address' = ${address}
    `
    const response = toFaunaFormatArray(result, 'visitors')
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
