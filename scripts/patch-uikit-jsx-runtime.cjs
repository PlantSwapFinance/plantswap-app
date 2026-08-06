#!/usr/bin/env node
/* eslint-disable */
// Patch `@plantswap/uikit`'s ESM build so that `react/jsx-dev-runtime`
// is replaced with `react/jsx-runtime` (the production JSX runtime).
//
// Why this exists:
//
//   `@plantswap/uikit@1.0.0-alpha.0` and `1.0.1` both import
//   `react/jsx-dev-runtime` at the top of `dist/index.esm.js`:
//
//     import { jsxDEV, Fragment } from 'react/jsx-dev-runtime';
//     ...
//     const DefaultSeparator = /*#__PURE__*/jsxDEV(Icon$39, ...);
//
//   That's a *development* JSX runtime. Vite 8 / rolldown splits the
//   package across chunks in a way that lets the call site evaluate
//   before the import binding is initialized:
//
//     index.esm.js:8050 Uncaught TypeError: (0, q.jsxDEV) is not a function
//
//   The production runtime (`react/jsx-runtime`) exports `jsx` (and
//   `jsxs`) with the same calling convention uikit uses — trailing
//   `source` / `self` arguments are optional and ignored — so swapping
//   the import is safe.
//
// Run as a postinstall step. Idempotent.

const fs = require('fs')
const path = require('path')

const TARGET_FILES = [
  'node_modules/@plantswap/uikit/dist/index.esm.js',
  'node_modules/@plantswap/uikit/dist/index.cjs.js',
]

const ROOT = process.cwd()

function patch(file) {
  const abs = path.join(ROOT, file)
  if (!fs.existsSync(abs)) {
    // Some Yarn / PnP layouts don't put uikit at the top level — bail.
    return false
  }
  let src = fs.readFileSync(abs, 'utf8')
  const before = src

  // 1. Swap the import: dev → production runtime.
  src = src.replace(
    /from\s*['"]react\/jsx-dev-runtime['"]/g,
    `from 'react/jsx-runtime'`,
  )

  // 2. Rename the local binding so call sites resolve.
  //    The dev runtime exports `jsxDEV`; the production one doesn't
  //    — it exports `jsx` and `jsxs`. After step 1, calls to `jsxDEV`
  //    would point at an undefined name. Add an alias.
  src = src.replace(/import\s*\{\s*jsxDEV\s*,\s*Fragment\s*\}\s*from\s*['"]react\/jsx-runtime['"];?/,
    `import { jsx as jsxDEV, jsxs as jsxsDEV, Fragment } from 'react/jsx-runtime';`)

  // 3. Some callsites may still be `jsxDEV(...)`. Production `jsx`
  //    accepts the same first three arguments, so leave them alone —
  //    `jsxDEV` is now an alias for `jsx`.

  if (src !== before) {
    fs.writeFileSync(abs, src, 'utf8')
    process.stdout.write(`patched ${file}\n`)
    return true
  }
  return false
}

let patched = 0
for (const f of TARGET_FILES) {
  if (patch(f)) patched += 1
}
process.stdout.write(`done (${patched} file${patched === 1 ? '' : 's'} patched)\n`)
