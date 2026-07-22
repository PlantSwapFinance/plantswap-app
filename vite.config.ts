import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    tsconfigPaths: true,
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
