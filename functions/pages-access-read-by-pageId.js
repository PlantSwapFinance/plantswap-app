const getPathParams = require('./utils/getPathParams')
const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `pages-access-read-by-pageId` invoked')
  const sql = getClient()
  const pageId = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM pages_access WHERE data->>'pageId' = ${pageId}
    `
    const response = toFaunaFormatArray(result, 'pages_access')
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
