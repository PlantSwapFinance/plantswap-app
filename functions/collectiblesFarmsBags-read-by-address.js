const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `collectiblesFarmsBags-read-by-address` invoked')
  const sql = getClient()
  const address = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM collectibles_farms_bags WHERE data->>'address' = ${address}
    `
    const response = toFaunaFormatArray(result, 'collectiblesFarmsBags')
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
