import { CID } from 'multiformats/cid'
import { decode, toB58String } from 'multihashes'

function hexToUint8Array(hex: string): Uint8Array {
  // eslint-disable-next-line no-param-reassign
  hex = hex.startsWith('0x') ? hex.substr(2) : hex
  if (hex.length % 2 !== 0) throw new Error('hex must have length that is multiple of 2')
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return arr
}

const UTF_8_DECODER = new TextDecoder()

// Multicodec table-prefix values used by ENS contenthash. Inlined because the
// standalone `multicodec` package is deprecated in favour of `multiformats`,
// which does not currently ship a multicodec table module.
const PREFIX_IPFS_NS = 0xe3 // 'ipfs-ns'
const PREFIX_IPNS_NS = 0xe5 // 'ipns-ns'

type SupportedCodec = 'ipfs-ns' | 'ipns-ns'

function getCodec(buf: Uint8Array): SupportedCodec {
  // Multicodec prefixes are unsigned varints. Both supported codecs here are
  // single-byte (< 0x80), so the varint fits in one byte.
  const first = buf[0]
  if ((first & 0x80) !== 0) throw new Error(`Unrecognized codec prefix: 0x${first.toString(16)}`)
  switch (first) {
    case PREFIX_IPFS_NS:
      return 'ipfs-ns'
    case PREFIX_IPNS_NS:
      return 'ipns-ns'
    default:
      throw new Error(`Unrecognized codec: 0x${first.toString(16)}`)
  }
}

function rmPrefix(buf: Uint8Array): Uint8Array {
  // Strip a leading unsigned varint (continuation bytes have the high bit set;
  // the terminator byte has it clear).
  let i = 0
  while ((buf[i] & 0x80) !== 0) i++
  i++
  return buf.subarray(i)
}

/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
export default function contenthashToUri(contenthash: string): string {
  const buff = hexToUint8Array(contenthash)
  const codec = getCodec(buff)
  switch (codec) {
    case 'ipfs-ns': {
      const data = rmPrefix(buff)
      const cid = CID.decode(data)
      return `ipfs://${toB58String(cid.multihash.bytes)}`
    }
    case 'ipns-ns': {
      const data = rmPrefix(buff)
      const cid = CID.decode(data)
      const multihash = decode(cid.multihash.bytes)
      if (multihash.name === 'identity') {
        return `ipns://${UTF_8_DECODER.decode(multihash.digest).trim()}`
      }
      return `ipns://${toB58String(cid.multihash.bytes)}`
    }
    default:
      throw new Error(`Unrecognized codec: ${codec}`)
  }
}