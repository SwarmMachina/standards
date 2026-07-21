import { defineConfig } from 'eslint/config'
import javascriptConfig from './eslint-js.config.mjs'
import { typescriptOverride } from './internal/eslint-typescript.mjs'

export default defineConfig(...javascriptConfig, typescriptOverride)
