/**
 * Post-build step: writes crawler-readable HTML for every indexable route,
 * plus build/llms.txt.
 *
 * PlantSwap is a client-rendered SPA, so without this every URL serves the
 * same index.html: home title, no canonical and an empty <div id="root">.
 * Google renders JavaScript, but Bing's first pass, social unfurlers and AI
 * crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, …) mostly do not.
 *
 * For each route in INDEXABLE_ROUTES this script copies build/index.html,
 * replaces the block between <!-- seo:start --> and <!-- seo:end --> with that
 * route's title, description, canonical, Open Graph, Twitter and JSON-LD
 * (same data PageMeta uses in the app), and fills #root with a short static
 * summary and links. React's createRoot replaces #root on load and
 * src/index.tsx removes the [data-prerender] head tags, so users still get the
 * normal app.
 *
 * Files are written as build/<route>.html (e.g. build/farms.html,
 * build/foundation/donate.html). Netlify serves /farms from farms.html before
 * applying the /* rewrite in public/_redirects, without adding a trailing
 * slash, which keeps the URL equal to the canonical. That rewrite points at
 * build/app.html, a neutral SPA shell, so index.html only ever serves /.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  DEFAULT_META,
  DEFAULT_OG_IMAGE,
  INDEXABLE_ROUTES,
  SITE_NAME,
  SITE_URL,
  getCanonicalUrl,
  getCustomMeta,
  getPageSchemas,
} from '../src/config/constants/meta'
import { PROJECT_FAQ } from '../src/config/constants/faq'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUILD = path.join(__dirname, '..', 'build')
const TEMPLATE = path.join(BUILD, 'index.html')
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
const ROOT_DIV = '<div id="root"></div>'

const HOME_HEADING = 'PlantSwap — DeFi on Binance Smart Chain that helps the planet'
const BRAND_SUFFIX = ` | ${SITE_NAME}`

// Same identity translator the app falls back to when a key has no translation.
const t = (key: string) => key

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// JSON inside <script> must not be able to close the tag.
const jsonLd = (data: Record<string, unknown>) => JSON.stringify(data).replace(/</g, '\\u003c')

const faqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PROJECT_FAQ.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

const PRERENDER_STYLE = `<style data-prerender>
      .prerender{max-width:720px;margin:0 auto;padding:32px 16px;font-family:Kanit,system-ui,sans-serif;line-height:1.6;color:#280d5f}
      .prerender a{color:#1fc7d4}
      .prerender nav ul{display:flex;flex-wrap:wrap;gap:8px 16px;list-style:none;padding:0}
    </style>`

const renderHead = (routePath: string) => {
  const meta = { ...DEFAULT_META, ...(getCustomMeta(routePath, t) || {}) }
  const { title, description, image } = meta
  const canonical = getCanonicalUrl(routePath)
  const schemas = getPageSchemas(routePath, meta)
  if (routePath === '/project') schemas.push(faqSchema())

  const tags = [
    `<title data-prerender>${escapeHtml(title)}</title>`,
    `<meta data-prerender name="description" content="${escapeHtml(description)}" />`,
    `<meta data-prerender name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<link data-prerender rel="canonical" href="${canonical}" />`,
    `<meta data-prerender property="og:title" content="${escapeHtml(title)}" />`,
    `<meta data-prerender property="og:description" content="${escapeHtml(description)}" />`,
    `<meta data-prerender property="og:url" content="${canonical}" />`,
    `<meta data-prerender property="og:image" content="${image}" />`,
    ...(image === DEFAULT_OG_IMAGE
      ? [
          `<meta data-prerender property="og:image:width" content="1058" />`,
          `<meta data-prerender property="og:image:height" content="537" />`,
        ]
      : []),
    `<meta data-prerender property="og:image:alt" content="${escapeHtml(title)}" />`,
    `<meta data-prerender name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta data-prerender name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta data-prerender name="twitter:image" content="${image}" />`,
    ...schemas.map((s) => `<script data-prerender type="application/ld+json">${jsonLd(s)}</script>`),
    PRERENDER_STYLE,
  ]
  return { meta, block: `<!-- seo:start -->\n    ${tags.join('\n    ')}\n    <!-- seo:end -->` }
}

const renderBody = (routePath: string, title: string, description: string) => {
  const heading = routePath === '/' ? HOME_HEADING : title.replace(BRAND_SUFFIX, '')
  const parts = [`<h1>${escapeHtml(heading)}</h1>`, `<p>${escapeHtml(description)}</p>`]

  if (routePath === '/') {
    parts.push(`<p>${escapeHtml(PROJECT_FAQ[0].answer)}</p>`)
  }
  if (routePath === '/project') {
    parts.push('<h2>Frequently asked questions</h2>')
    PROJECT_FAQ.forEach(({ question, answer }) => {
      parts.push(`<h3>${escapeHtml(question)}</h3>`, `<p>${escapeHtml(answer)}</p>`)
    })
  }

  const links = INDEXABLE_ROUTES.map((r) => `<li><a href="${r.path}">${escapeHtml(r.name)}</a></li>`).join('')
  return `<div id="root"><div class="prerender">
      <header><a href="/"><img src="/logo.png" alt="PlantSwap logo" width="48" height="48" /> ${SITE_NAME}</a></header>
      <main>${parts.join('\n        ')}</main>
      <nav aria-label="${SITE_NAME} pages"><ul>${links}</ul></nav>
    </div></div>`
}

const outputFile = (routePath: string) =>
  routePath === '/' ? TEMPLATE : path.join(BUILD, `${routePath.replace(/^\//, '')}.html`)

const renderLlmsTxt = (pages: { path: string; name: string; description: string }[]) => {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${DEFAULT_META.description}`,
    '',
    PROJECT_FAQ[0].answer,
    '',
    '## Pages',
    '',
    ...pages.map((p) => `- [${p.name}](${getCanonicalUrl(p.path)}): ${p.description}`),
    '',
    '## FAQ',
    '',
    ...PROJECT_FAQ.flatMap(({ question, answer }) => [`### ${question}`, '', answer, '']),
    '## Optional',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml): every indexable page`,
    '- [Source code](https://github.com/PlantSwapFinance): PlantSwap repositories on GitHub',
    '',
  ]
  return lines.join('\n')
}

const template = fs.readFileSync(TEMPLATE, 'utf8')
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('[prerender] build/index.html is missing the seo:start/seo:end markers or an empty #root')
}

const pages = INDEXABLE_ROUTES.map((route) => {
  const { meta, block } = renderHead(route.path)
  const html = template
    .replace(SEO_BLOCK, () => block)
    .replace(ROOT_DIV, () => renderBody(route.path, meta.title, meta.description))
  const file = outputFile(route.path)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html, 'utf8')
  return { path: route.path, name: route.name, description: meta.description }
})

// SPA shell for every other URL (dynamic routes, unknown paths), served via the
// /* rewrite in public/_redirects. It carries no canonical or og:url so a
// non-JS crawler never sees e.g. /teams/3 claim to be the home page; PageMeta
// adds the right tags once the app renders.
const shellBlock = [
  '<!-- seo:start -->',
  `<title data-prerender>${escapeHtml(DEFAULT_META.title)}</title>`,
  `<meta data-prerender name="description" content="${escapeHtml(DEFAULT_META.description)}" />`,
  `<meta data-prerender property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
  `<meta data-prerender name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  '<!-- seo:end -->',
].join('\n    ')
fs.writeFileSync(
  path.join(BUILD, 'app.html'),
  template.replace(SEO_BLOCK, () => shellBlock),
  'utf8',
)

fs.writeFileSync(path.join(BUILD, 'llms.txt'), renderLlmsTxt(pages), 'utf8')

// eslint-disable-next-line no-console
console.log(`[prerender] wrote ${pages.length} pages, app.html and llms.txt to ${BUILD}`)
