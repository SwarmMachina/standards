import { defineConfig } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import typescriptConfig from './eslint-typescript.config.mjs'
import { recommendedTypeScriptRules, tseslint, typescriptRules } from './internal/eslint-typescript.mjs'

export default defineConfig(...typescriptConfig, ...vue.configs['flat/recommended'], {
  files: ['**/*.vue'],
  plugins: {
    '@typescript-eslint': tseslint.plugin
  },
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser
    }
  },
  rules: {
    ...recommendedTypeScriptRules,
    ...typescriptRules
  }
})
