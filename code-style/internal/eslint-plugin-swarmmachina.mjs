const blockValuedInitializerTypes = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'ObjectExpression'])
const transparentInitializerTypes = new Set([
  'ChainExpression',
  'TSAsExpression',
  'TSNonNullExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion'
])
const variableKinds = new Set(['const', 'let', 'var'])

const unwrapInitializer = (initializer) => {
  let current = initializer

  while (current && transparentInitializerTypes.has(current.type)) {
    current = current.expression
  }

  return current
}

const isBlockValuedConst = (statement) => {
  if (statement.type !== 'VariableDeclaration' || statement.kind !== 'const') {
    return false
  }

  if (statement.declarations.length !== 1) {
    return false
  }

  const [declaration] = statement.declarations
  const initializer = unwrapInitializer(declaration.init)

  return declaration.id.type === 'Identifier' && blockValuedInitializerTypes.has(initializer?.type)
}

const findPaddingGaps = (sourceCode, previous, current) => {
  const tokens = [
    sourceCode.getLastToken(previous),
    ...sourceCode.getTokensBetween(previous, current, { includeComments: true }),
    sourceCode.getFirstToken(current)
  ]
  const gaps = []

  for (let index = 1; index < tokens.length; index += 1) {
    const before = tokens[index - 1]
    const after = tokens[index]

    if (after.loc.start.line - before.loc.end.line >= 2) {
      gaps.push([before, after])
    }
  }

  return gaps
}

const removePaddingLines = (text) => {
  const lineBreak = text.includes('\r\n') ? '\r\n' : '\n'
  const trailingIndent = text.match(/[^\S\r\n]*$/u)?.[0] ?? ''
  const leadingWhitespace = text.match(/^[^\S\r\n]*/u)?.[0] ?? ''

  return `${leadingWhitespace}${lineBreak}${trailingIndent}`
}

const variableDeclarationSpacing = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Disallow blank lines between variable declarations except around function- and object-valued const declarations'
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      unexpectedBlankLine: 'Unexpected blank line before this variable declaration.'
    }
  },

  create(context) {
    const sourceCode = context.sourceCode

    const verifyStatements = (statements) => {
      for (let index = 1; index < statements.length; index += 1) {
        const previous = statements[index - 1]
        const current = statements[index]

        if (
          previous.type !== 'VariableDeclaration' ||
          current.type !== 'VariableDeclaration' ||
          !variableKinds.has(previous.kind) ||
          !variableKinds.has(current.kind)
        ) {
          continue
        }

        if (
          (previous.kind === 'const' && current.kind === 'let') ||
          (previous.kind === 'let' && current.kind === 'const')
        ) {
          continue
        }

        if (isBlockValuedConst(previous) || isBlockValuedConst(current)) {
          continue
        }

        const paddingGaps = findPaddingGaps(sourceCode, previous, current)

        if (paddingGaps.length === 0) {
          continue
        }

        context.report({
          node: current,
          messageId: 'unexpectedBlankLine',
          fix(fixer) {
            if (paddingGaps.length !== 1) {
              return null
            }

            const [before, after] = paddingGaps[0]
            const range = [before.range[1], after.range[0]]
            const text = sourceCode.text.slice(...range)

            return fixer.replaceTextRange(range, removePaddingLines(text))
          }
        })
      }
    }

    return {
      Program: (node) => verifyStatements(node.body),
      BlockStatement: (node) => verifyStatements(node.body),
      StaticBlock: (node) => verifyStatements(node.body),
      SwitchCase: (node) => verifyStatements(node.consequent)
    }
  }
}

export const swarmmachinaPlugin = {
  rules: {
    'variable-declaration-spacing': variableDeclarationSpacing
  }
}
