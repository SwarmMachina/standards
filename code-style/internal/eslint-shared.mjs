import js from '@eslint/js'
import jsdoc from 'eslint-plugin-jsdoc'
import globals from 'globals'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintConfigPrettier from 'eslint-config-prettier'
import { swarmmachinaPlugin } from './eslint-plugin-swarmmachina.mjs'

export const javascriptFoundation = [
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
  }
]

export const prettierCompatibility = eslintConfigPrettier

export const sharedRules = {
  plugins: {
    jsdoc,
    promise: eslintPluginPromise,
    swarmmachina: swarmmachinaPlugin
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
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      },
      { blankLine: 'always', prev: 'let', next: 'const' },
      { blankLine: 'always', prev: 'const', next: 'let' },
      { blankLine: 'always', prev: '*', next: 'return' },
      {
        blankLine: 'always',
        prev: '*',
        next: ['if', 'for', 'while']
      },
      {
        blankLine: 'always',
        prev: ['if', 'for', 'while'],
        next: '*'
      }
    ],
    'swarmmachina/variable-declaration-spacing': 'error',

    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-property-description': 'off',
    'jsdoc/no-undefined-types': 'off'
  }
}
