import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import jsdoc from 'eslint-plugin-jsdoc'
import stylistic from '@stylistic/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginN from 'eslint-plugin-n'
import eslintPluginPromise from 'eslint-plugin-promise'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['dist', 'node_modules', 'tmp', 'temp'] },

  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    }
  },

  ...vue.configs['flat/recommended'],

  {
    plugins: {
      jsdoc
    },
    rules: {
      ...jsdoc.configs['flat/recommended'].rules,
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/no-undefined-types': 'off'
    }
  },

  {
    plugins: {
      import: eslintPluginImport,
      n: eslintPluginN,
      promise: eslintPluginPromise
    },
    rules: {
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginN.configs.recommended.rules,
      ...eslintPluginPromise.configs.recommended.rules
    }
  },

  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'warn',
      'object-shorthand': ['warn', 'properties'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
      ],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'only-multiline']
    }
  },

  eslintPluginPrettierRecommended,

  {
    rules: {
      'n/no-unpublished-import': 'off',
      curly: ['error']
    }
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      'import/no-unresolved': 'off',
      'n/no-unpublished-import': 'off'
    }
  }
]
