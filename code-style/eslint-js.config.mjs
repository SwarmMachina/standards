import { defineConfig } from 'eslint/config'
import { javascriptFoundation, prettierCompatibility, sharedRules } from './internal/eslint-shared.mjs'

export default defineConfig(...javascriptFoundation, prettierCompatibility, sharedRules)
