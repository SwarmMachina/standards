import { defineConfig } from 'eslint/config'
import config from './eslint.config.mjs'
import { typescriptOverride } from './internal/eslint-typescript.mjs'

// Compatibility entry point from standards 1.2: JavaScript + Vue + TypeScript.
export default defineConfig(...config, typescriptOverride)
