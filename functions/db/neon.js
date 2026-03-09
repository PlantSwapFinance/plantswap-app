/**
 * Neon serverless PostgreSQL client
 */
const { neon } = require('@neondatabase/serverless')

function getClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for Neon database')
  }
  return neon(connectionString)
}

function formatRow(row) {
  if (!row) return null
  const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  return { id: row.id, data }
}

function formatRows(rows) {
  if (!rows || !Array.isArray(rows)) return []
  return rows.map(formatRow)
}

module.exports = {
  getClient,
  formatRow,
  formatRows
}
