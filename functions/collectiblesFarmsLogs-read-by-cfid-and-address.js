const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `collectiblesFarmsLogs-read-by-cfid-and-address` invoked')
  const sql = getClient()
  const [cfId, address] = getPathParams(event.path, 2)
  try {
    const result = await sql`
      SELECT id, data FROM collectibles_farms_logs
      WHERE data->>'cfId' = ${cfId} AND data->>'address' = ${address}
    `
    const response = toFaunaFormatArray(result, 'collectiblesFarmsLogs')
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
