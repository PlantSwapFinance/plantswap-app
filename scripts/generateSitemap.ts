/**
 * Generates build/sitemap.xml at build time.
 *
 * Run automatically after `vite build` via the chained `build` script
 * in package.json. Also runnable directly via `yarn sitemap:generate`.
 *
 * Source of truth for which URLs to include is INDEXABLE_ROUTES in
 * src/config/constants/meta.ts. Update it when adding/removing public routes.
 * Dynamic routes (e.g. /foundation/proposal/:id) are intentionally NOT listed —
 * the sitemap spec only covers canonical pages.
 *
 * <lastmod> is the last git commit date of each route's source files, so it
 * only moves when the page actually changes. If git history is unavailable the
 * tag is omitted rather than faked with the build date.
 */

import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { INDEXABLE_ROUTES, SITE_URL } from '../src/config/constants/meta'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.join(__dirname, '..')
const OUTPUT = path.join(ROOT, 'build', 'sitemap.xml')

const lastCommitDate = (sources: string[]): string | null => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null
  } catch {
    return null
  }
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const body = INDEXABLE_ROUTES.map((r) => {
  const loc = escapeXml(`${SITE_URL}${r.path}`)
  const lastmod = lastCommitDate(r.sources)
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    `    <changefreq>${r.changefreq}</changefreq>`,
    `    <priority>${r.priority.toFixed(1)}</priority>`,
    '  </url>',
  ].join('\n')
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, xml, 'utf8')
// eslint-disable-next-line no-console
console.log(`[sitemap] wrote ${INDEXABLE_ROUTES.length} URLs to ${OUTPUT}`)
