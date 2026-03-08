/**
 * Neon serverless PostgreSQL client
 * Replaces FaunaDB for PlantSwap
 */
const { neon } = require('@neondatabase/serverless')

function getClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for Neon database')
  }
  return neon(connectionString)
}

/**
 * Normalize a database row to Fauna-compatible format for frontend compatibility
 * Fauna returns: { ref: { "@ref": { id: "...", collection: {...} } }, data: {...} }
 */
function toFaunaFormat(row, collectionName) {
  if (!row) return null
  const id = row.id
  const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  return {
    ref: {
      '@ref': {
        id: id,
        collection: { '@ref': { id: collectionName } }
      }
    },
    data: data
  }
}

/**
 * Normalize multiple rows to Fauna-compatible format
 */
function toFaunaFormatArray(rows, collectionName) {
  if (!rows || !Array.isArray(rows)) return []
  return rows.map(row => toFaunaFormat(row, collectionName))
}

module.exports = {
  getClient,
  toFaunaFormat,
  toFaunaFormatArray
}
