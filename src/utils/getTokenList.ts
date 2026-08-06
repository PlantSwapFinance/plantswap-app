/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'
import contenthashToUri from './contenthashToUri'
import { parseENSAddress } from './ENS/parseENSAddress'
import uriToHttp from './uriToHttp'

// The Uniswap token-list schema uses the JSON Schema `"date-time"` format
// for its `timestamp` field, which ajv 8.x no longer ships with by default
// and treats as a hard schema error in strict mode (it throws
// `unknown format "date-time" ignored in schema at path "#/properties/timestamp"`
// at compile time, white-paging the app). Disabling `strictSchema` lets the
// validator compile while still flagging other real schema issues.
const tokenListValidator = new Ajv({ allErrors: true, strictSchema: false }).compile(schema)

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export default async function resolveListFromUrl(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>,
): Promise<TokenList> {
  const parsedENS = parseENSAddress(listUrl)
  let urls: string[]
  if (parsedENS) {
    let contentHashUri
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName)
    } catch (error) {
      console.error(`Failed to resolve ENS name: ${parsedENS.ensName}`, error)
      throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`)
    }
    let translatedUri
    try {
      translatedUri = contenthashToUri(contentHashUri)
    } catch (error) {
      console.error('Failed to translate contenthash to URI', contentHashUri)
      throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`)
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`)
  } else {
    urls = uriToHttp(listUrl)
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url)
    } catch (error) {
      console.error('Failed to fetch list', listUrl, error)
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    // Guard against non-JSON responses (e.g. an HTML 404 page from a missing dev backend).
    // `response.json()` throws "Unexpected token <, <!DOCTYPE ..." or
    // "Unexpected end of JSON input" on those, surfacing as an uncaught
    // `Uncaught (in promise) SyntaxError`. Swallow the parse error and
    // move on to the next URL or surface a clean "Failed to download list"
    // error so the rest of the app keeps running.
    const text = await response.text()
    if (!text) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }
    let json
    try {
      json = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse token list JSON', listUrl, parseError)
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${(error as any).dataPath} ${error.message ?? ''}`
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`
        }, '') ?? 'unknown error'
      throw new Error(`Token list failed validation: ${validationErrors}`)
    }
    return json as TokenList
  }
  throw new Error('Unrecognized list URL protocol.')
}
