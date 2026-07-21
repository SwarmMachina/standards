import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import config from './eslint.config.mjs'

export default defineConfig(...config, {
  files: ['**/*.{ts,cts,mts,tsx}'],
  extends: [tseslint.configs.recommended],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-type': 'off'
  }
})
