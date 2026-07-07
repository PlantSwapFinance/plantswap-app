/**
 * Generates build/sitemap.xml at build time.
 *
 * Run automatically after `react-scripts build` via the chained `build` script
 * in package.json. Also runnable directly via `yarn sitemap:generate`.
 *
 * Source of truth for which URLs to include is the INDEXABLE_ROUTES table
 * below. Update it when adding/removing public routes. Dynamic routes (e.g.
 * /foundation/proposal/:id) are intentionally NOT listed — the sitemap spec
 * only covers canonical pages.
 */

import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://plantswap.finance'
const OUTPUT = path.join(__dirname, '..', 'build', 'sitemap.xml')

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface Route {
  loc: string
  changefreq: ChangeFreq
  priority: number
}

const INDEXABLE_ROUTES: Route[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/swap', changefreq: 'daily', priority: 0.9 },
  { loc: '/farms', changefreq: 'hourly', priority: 0.9 },
  { loc: '/gardens', changefreq: 'hourly', priority: 0.9 },
  { loc: '/pools', changefreq: 'hourly', priority: 0.9 },
  { loc: '/verticalGardens', changefreq: 'daily', priority: 0.8 },
  { loc: '/collectiblesFarms', changefreq: 'daily', priority: 0.8 },
  { loc: '/collectibles', changefreq: 'daily', priority: 0.8 },
  { loc: '/market', changefreq: 'daily', priority: 0.8 },
  { loc: '/foundation', changefreq: 'daily', priority: 0.8 },
  { loc: '/foundation/donate', changefreq: 'weekly', priority: 0.7 },
  { loc: '/project', changefreq: 'monthly', priority: 0.7 },
  { loc: '/roadmap', changefreq: 'monthly', priority: 0.7 },
  { loc: '/developmentFund', changefreq: 'weekly', priority: 0.7 },
  { loc: '/tree', changefreq: 'weekly', priority: 0.7 },
  { loc: '/teams', changefreq: 'daily', priority: 0.5 },
  { loc: '/contact-us', changefreq: 'yearly', priority: 0.4 },
]

const lastmod = new Date().toISOString().slice(0, 10)

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const body = INDEXABLE_ROUTES.map((r) => {
  const loc = escapeXml(`${SITE_URL}${r.loc}`)
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, xml, 'utf8')
// eslint-disable-next-line no-console
console.log(`[sitemap] wrote ${INDEXABLE_ROUTES.length} URLs to ${OUTPUT} (lastmod=${lastmod})`)
