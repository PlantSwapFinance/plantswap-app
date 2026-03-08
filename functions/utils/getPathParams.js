/**
 * Extract path parameters from Netlify function event
 * For path like /.netlify/functions/users-read-by-email/foo@bar.com
 * Returns "foo@bar.com" (single param)
 *
 * For path like /.netlify/functions/collectiblesFarmsLogs-read-by-cfid-and-address/1/0x123
 * Returns ["1", "0x123"] when segmentCount is 2
 * Uses last N segments to work regardless of path format
 */
function getPathParams(eventPath, segmentCount = 1) {
  const segments = eventPath.split('/').filter(Boolean)
  const params = segments.slice(-segmentCount)
  if (segmentCount === 1) {
    return params[0] || null
  }
  return params
}

module.exports = getPathParams
