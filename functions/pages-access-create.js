const { getClient, toFaunaFormat } = require('./db/neon')

exports.handler = async (event, context) => {
  const sql = getClient()
  const data = JSON.parse(event.body || '{}')
  console.log('Function `pages-access-create` invoked', data)
  try {
    const result = await sql`
      INSERT INTO pages_access (data)
      VALUES (${JSON.stringify(data)})
      RETURNING id, data
    `
    const row = result[0]
    const response = toFaunaFormat(row, 'pages_access')
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
