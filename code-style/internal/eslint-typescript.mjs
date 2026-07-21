import tseslint from 'typescript-eslint'

export const typescriptFiles = ['**/*.{ts,cts,mts,tsx}']

export const typescriptRules = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
  'jsdoc/require-jsdoc': 'off',
  'jsdoc/require-param': 'off',
  'jsdoc/require-param-type': 'off',
  'jsdoc/require-returns': 'off',
  'jsdoc/require-returns-type': 'off'
}

export const recommendedTypeScriptRules = Object.assign(
  {},
  ...tseslint.configs.recommended.map((config) => config.rules ?? {})
)

export const typescriptOverride = {
  files: typescriptFiles,
  extends: [tseslint.configs.recommended],
  rules: typescriptRules
}

export { tseslint }
