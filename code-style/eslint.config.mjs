import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import jsdoc from 'eslint-plugin-jsdoc'
import globals from 'globals'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintConfigPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'tmp/**', 'temp/**']
  },

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

  eslintConfigPrettier,

  {
    plugins: {
      jsdoc,
      promise: eslintPluginPromise
    },
    rules: {
      ...jsdoc.configs['flat/recommended'].rules,
      ...eslintPluginPromise.configs.recommended.rules,

      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'warn',
      'object-shorthand': ['warn', 'properties'],
      curly: ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'never',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var']
        },
        { blankLine: 'always', prev: 'if', next: 'if' }
      ],

      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/no-undefined-types': 'off'
    }
  }
]
