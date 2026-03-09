const getId = require('./utils/getId')
const { getClient, formatRow } = require('./db/neon')

exports.handler = async (event, context) => {
  const sql = getClient()
  const id = getId(event.path)
  console.log(`Function 'collectiblesFarmsBags-read' invoked. Read id: ${id}`)
  try {
    const result = await sql`
      SELECT id, data FROM collectibles_farms_bags WHERE id = ${id}
    `
    const row = result[0]
    if (!row) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Collectibles farm bag not found' })
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
