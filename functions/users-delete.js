const getId = require('./utils/getId')
const { getClient } = require('./db/neon')

exports.handler = async (event, context) => {
  const sql = getClient()
  const id = getId(event.path)
  console.log(`Function 'users-delete' invoked. delete id: ${id}`)
  try {
    const result = await sql`
      DELETE FROM users WHERE id = ${id}
      RETURNING id, data
    `
    const row = result[0]
    if (!row) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      }
    }
    const response = {
      ref: { '@ref': { id: row.id, collection: { '@ref': { id: 'users' } } } },
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    }
    console.log('success', response)
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
