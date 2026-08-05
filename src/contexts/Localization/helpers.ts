import { EN } from 'config/localization/languages'

// Vite replaces CRA's `process.env.PUBLIC_URL` with `import.meta.env.BASE_URL`
// (derived from Vite's `base` config, which defaults to '/'). The `process`
// global is undefined in the browser, so referencing it at module load throws
// `ReferenceError: process is not defined` and white-pages the app.
const publicUrl = import.meta.env.BASE_URL

export const LS_KEY = 'plantswap_language'

export const fetchLocale = async (locale) => {
  const response = await fetch(`${publicUrl}/locales/${locale}.json`)
  const data = await response.json()
  return data
}

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY)

    return codeFromStorage || EN.locale
  } catch {
    return EN.locale
  }
}
