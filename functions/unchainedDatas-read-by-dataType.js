const getPathParams = require('./utils/getPathParams')
const { getClient, formatRows } = require('./db/neon')

exports.handler = async (event, context) => {
  const path = event.path || event.rawPath || (typeof event.url === 'string' ? new URL(event.url).pathname : '') || ''
  const dataType = getPathParams(path, 1)
  console.log('Function `unchainedDatas-read-by-dataType` invoked', { path, dataType })

  if (!dataType) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'dataType path parameter is required' })
    }
  }

  const sql = getClient()
  try {
    const result = await sql`
      SELECT id, data FROM unchained_datas WHERE data->>'dataType' = ${dataType}
    `
    const response = formatRows(result)
    console.log(`${response.length} unchained_datas found for dataType=${dataType}`)
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
