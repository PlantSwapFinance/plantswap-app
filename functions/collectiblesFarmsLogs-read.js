const getId = require('./utils/getId')
const { getClient, toFaunaFormat } = require('./db/neon')

exports.handler = async (event, context) => {
  const sql = getClient()
  const id = getId(event.path)
  console.log(`Function 'collectiblesFarmsLogs-read' invoked. Read id: ${id}`)
  try {
    const result = await sql`
      SELECT id, data FROM collectibles_farms_logs WHERE id = ${id}
    `
    const row = result[0]
    if (!row) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Collectibles farm log not found' })
      }
    }
    const response = toFaunaFormat(row, 'collectiblesFarmsLogs')
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
