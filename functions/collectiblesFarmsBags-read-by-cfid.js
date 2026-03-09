const getPathParams = require('./utils/getPathParams')
const { getClient, formatRows } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `collectiblesFarmsBags-read-by-cfid` invoked')
  const sql = getClient()
  const cfId = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM collectibles_farms_bags WHERE data->>'cfId' = ${cfId}
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
