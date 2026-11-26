import { globals, js, prettier, react, reactHooks, tseslint } from '@plantswap/eslint-config-local'

export default tseslint.config(
  {
    ignores: ['build/**', 'dist/**', 'public/**', 'functions/**', 'nfts/**', 'shims/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021, ...globals.jest },
    },
    settings: { react: { version: '19.0' } },
    rules: {
      // Hooks (same two rules the old airbnb/hooks preset enabled)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Carried over from @pancakeswap/eslint-config-pancake
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-shadow': 'off',
      'react/prop-types': 'off',
      // react-three-fiber elements (<mesh>, <primitive>, lights) take three.js props
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'args',
            'attach',
            'castShadow',
            'decay',
            'dispose',
            'geometry',
            'intensity',
            'material',
            'object',
            'position',
            'receiveShadow',
            'rotation',
            'scale',
          ],
        },
      ],

      // Carried over from the old .eslintrc
      'no-console': ['warn', { allow: ['info', 'warn', 'error', 'debug'] }],
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state', 'memo'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@web3-react/core',
              importNames: ['useWeb3React'],
              message:
                "Use useActiveWeb3React from 'hooks/useActiveWeb3React' instead — it provides chainId/library fallbacks for disconnected users.",
            },
          ],
        },
      ],

      // Temporary: keep the error count at 0 while the codebase is migrated; remove and fix over time.
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': false, 'ts-nocheck': false }],
      '@typescript-eslint/no-explicit-any': 'off',
      // Not enforced while lint was broken; existing hits are warnings until fixed.
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-unassigned-vars': 'warn',
      'no-useless-assignment': 'warn',
      'preserve-caught-error': 'warn',
      'prefer-const': 'warn',
      'react/jsx-key': 'warn',
      'react/no-deprecated': 'warn',
    },
  },
  {
    files: ['src/hooks/useActiveWeb3React.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  prettier,
)
