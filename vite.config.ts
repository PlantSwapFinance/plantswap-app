import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Vite config for the PlantSwap frontend.
//
// - envPrefix keeps REACT_APP_* readable so the existing Netlify env
//   variables and %REACT_APP_*% placeholders in index.html keep working.
// - build.outDir is `build` to match netlify.toml's publish setting.
// - sourcemaps stay on for production debugging.
// - resolve.tsconfigPaths enables Vite 8's native tsconfig alias support.
// - The @pancakeswap/swap-sdk-core alias supplies the scaled-UI symbols
//   that swap-sdk-core@1.6.0 was meant to ship but does not. The shim
//   re-exports the real package and adds the missing exports — see
//   shims/swap-sdk-core.mjs.
// - optimizeDeps.pre-bundles @plantswap/uikit so the postinstall
//   patch (`scripts/patch-uikit-jsx-runtime.cjs`) and its JSX-runtime
//   imports end up in the same optimized chunk in dev.
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@pancakeswap/swap-sdk-core': path.resolve(__dirname, 'shims/swap-sdk-core.mjs'),
    },
  },
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
