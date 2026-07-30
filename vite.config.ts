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
// - The @pancakeswap/swap-sdk-evm alias substitutes a local stub for the
//   published package: swap-sdk-evm@1.2.1 (pulled in by @pancakeswap/sdk
//   5.9.1) imports scaled-UI symbols that swap-sdk-core 1.6.0 does not
//   export, so the umbrella @pancakeswap/sdk barrel fails to evaluate.
//   The stub is empty because nothing in this app actually imports from
//   swap-sdk-evm — Router and SwapParameters are re-exported by the
//   umbrella from @pancakeswap/v2-sdk instead.
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@pancakeswap/swap-sdk-evm': path.resolve(__dirname, 'shims/swap-sdk-evm.mjs'),
    },
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
