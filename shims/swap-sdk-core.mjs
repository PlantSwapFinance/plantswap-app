// Stub for `@pancakeswap/swap-sdk-core` that re-exports the real package and
// adds the scaled-UI symbols that swap-sdk-core 1.6.0 was supposed to ship
// but does not.
//
// @pancakeswap/swap-sdk-evm@1.2.1 (pulled in by @pancakeswap/sdk@5.9.1)
// imports SCALED_UI_DENOMINATOR, SCALED_UI_MULTIPLIER_DECIMALS,
// fromScaledUIAmount, isIdentityScaledUIMultiplier, and toScaledUIAmount
// from @pancakeswap/swap-sdk-core. The published swap-sdk-core@1.6.0
// tarball does not export any of them, so the swap-sdk-evm barrel fails
// to evaluate and every import of @pancakeswap/sdk breaks the build.
//
// Nothing in this app actually exercises these symbols, so the stubs
// below only need to satisfy module-resolution and call-shape. The values
// match the natural ERC-8056 fixed-point representation (1e18 multiplier
// basis, identity multiplier of 1e18). Replace this file once upstream
// publishes a swap-sdk-core that exports the real implementations.
//
// The re-export path is hardcoded to the package's installed location so
// Vite's resolve.alias does not redirect the import back to this shim.
export * from '../node_modules/@pancakeswap/swap-sdk-core/dist/index.mjs'

export const SCALED_UI_DENOMINATOR = 10n ** 18n
export const SCALED_UI_MULTIPLIER_DECIMALS = 18

export function fromScaledUIAmount(amount, _decimals) {
  return amount
}

export function toScaledUIAmount(amount, _decimals) {
  return amount
}

export function isIdentityScaledUIMultiplier(multiplier) {
  return multiplier === SCALED_UI_DENOMINATOR
}