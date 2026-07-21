import { defineConfig } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import { javascriptFoundation, prettierCompatibility, sharedRules } from './internal/eslint-shared.mjs'

export default defineConfig(
  ...javascriptFoundation,
  ...vue.configs['flat/recommended'],
  prettierCompatibility,
  sharedRules
)
