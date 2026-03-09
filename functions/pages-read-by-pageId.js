const getPathParams = require('./utils/getPathParams')
const { getClient, formatRows } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `pages-read-by-pageId` invoked')
  const sql = getClient()
  const pageId = getPathParams(event.path, 1)
  try {
    const result = await sql`
      SELECT id, data FROM pages WHERE data->>'pageId' = ${pageId}
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
