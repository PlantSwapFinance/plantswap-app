// Stub for `@pancakeswap/swap-sdk-evm`.
//
// `@pancakeswap/sdk@5.9.1` re-exports this package from its barrel, but the
// published `swap-sdk-evm@1.2.1` imports `SCALED_UI_DENOMINATOR`,
// `SCALED_UI_MULTIPLIER_DECIMALS`, `fromScaledUIAmount`,
// `isIdentityScaledUIMultiplier`, and `toScaledUIAmount` from
// `@pancakeswap/swap-sdk-core@1.6.0`, which does not export any of those
// symbols. Every import of `@pancakeswap/sdk` therefore fails to evaluate.
//
// This app only consumes `Router` and `SwapParameters`, both of which are
// re-exported by the umbrella SDK from `@pancakeswap/v2-sdk` directly
// (`export * from '@pancakeswap/v2-sdk'`). Nothing from
// `@pancakeswap/swap-sdk-evm` itself is needed, so the re-export can resolve
// to an empty module without affecting any consumer.
//
// Vite maps `@pancakeswap/swap-sdk-evm` to this file via `resolve.alias` in
// `vite.config.ts`. Remove this stub once upstream publishes a
// `swap-sdk-evm` that no longer references the missing scaled-UI symbols.
export {}