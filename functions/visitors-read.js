const getId = require('./utils/getId')
const { getClient, toFaunaFormat } = require('./db/neon')

exports.handler = async (event, context) => {
  const sql = getClient()
  const id = getId(event.path)
  console.log(`Function 'visitors-read' invoked. Read id: ${id}`)
  try {
    const result = await sql`
      SELECT id, data FROM visitors WHERE id = ${id}
    `
    const row = result[0]
    if (!row) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Visitor not found' })
      }
    }
    const response = toFaunaFormat(row, 'visitors')
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
