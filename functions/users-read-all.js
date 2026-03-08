const { getClient, toFaunaFormatArray } = require('./db/neon')

exports.handler = async (event, context) => {
  console.log('Function `users-read-all` invoked')
  const sql = getClient()
  try {
    const result = await sql`
      SELECT id, data FROM users ORDER BY created_at ASC
    `
    const response = toFaunaFormatArray(result, 'users')
    console.log(`${response.length} users found`)
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
