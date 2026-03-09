const getId = require('./utils/getId')
const { getClient, formatRow } = require('./db/neon')

exports.handler = async (event, context) => {
  const sql = getClient()
  const id = getId(event.path)
  const data = JSON.parse(event.body || '{}')
  console.log(`Function 'unchainedDatas-update' invoked. update id: ${id}`)
  try {
    const result = await sql`
      UPDATE unchained_datas
      SET data = ${JSON.stringify(data)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, data
    `
    const row = result[0]
    if (!row) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Unchained data not found' })
      }
    }
    const response = formatRow(row)
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
