const { getClient, formatRows } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `unchainedLogDatas-read-all` invoked')
  const sql = getClient()
  try {
    const result = await sql`
      SELECT id, data FROM unchained_log_datas ORDER BY created_at ASC
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
