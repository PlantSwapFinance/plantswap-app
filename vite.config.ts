import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Vite config for the PlantSwap frontend.
//
// Why this looks the way it does:
// - envPrefix keeps REACT_APP_* readable so the existing Netlify env
//   variables and %REACT_APP_*% placeholders in index.html keep working
//   without renaming the deployment variables.
// - build.outDir is `build` to match netlify.toml's publish setting.
// - sourcemaps stay on for production to keep runtime debugging usable.
// - resolve.tsconfigPaths enables Vite 8's native tsconfig path alias
//   resolution (the same plugin we used before is now built-in).
// - The @pancakeswap/swap-sdk-core alias adds the scaled-UI symbols that
//   swap-sdk-core@1.6.0 (pulled in by @pancakeswap/sdk@5.9.1) was supposed
//   to ship but does not. swap-sdk-evm@1.2.1 imports them at module
//   evaluation, so without the alias every import of @pancakeswap/sdk
//   fails to load. The shim re-exports everything from the real package
//   and only adds the missing exports — see shims/swap-sdk-core.mjs.
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@pancakeswap/swap-sdk-core': path.resolve(__dirname, 'shims/swap-sdk-core.mjs'),
    },
  },
  // `@plantswap/uikit@1.0.0-alpha.0` and `1.0.1` both unconditionally
  // `import { jsxDEV } from 'react/jsx-dev-runtime'` at the top of
  // `dist/index.esm.js`. Vite 8 / rolldown split the runtime into a
  // separate chunk that could load *after* uikit's call site,
  // throwing `(0, q.jsxDEV) is not a function`. The fix lives in
  // `scripts/patch-uikit-jsx-runtime.cjs` (run via `postinstall`),
  // which rewrites uikit's import to the production JSX runtime
  // (`react/jsx-runtime`) and aliases the local binding. Once
  // applied, no bundler config is needed.
  optimizeDeps: {
    include: ['@plantswap/uikit'],
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  server: {
    port: 3000,
    host: true,
  },
})
