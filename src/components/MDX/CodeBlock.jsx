import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsDark'

function CodeBlock(props) {
  const { isMac = true } = props
  const { children = '', className = 'language-js' } = props.children.props
  // e.g. "language-js"

  let language = className.substring(9)

  console.log(language)

  const isDiff = language.startsWith('diff-')

  let highlightStyle = []

  let code = children
  if (isDiff) {
    code = []
    language = language.substr(5)
    highlightStyle = children.split('\n').map((line) => {
      if (line.startsWith('+')) {
        code.push(line.substr(1))
        return 'inserted'
      }
      if (line.startsWith('-')) {
        code.push(line.substr(1))
        return 'deleted'
      }
      code.push(line)
    })
    code = code.join('\n')
  }

  const codeblock = (
    <Highlight {...defaultProps} theme={theme} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            textAlign: 'left',
            margin: 0,
            overflow: 'scroll',
            background: 'none',
          }}
        >
          <code>
            {tokens.map(
              (line, i) =>
                i < tokens.length - 1 && (
                  <span className={highlightStyle[i]} key={i}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                    <br />
                  </span>
                )
            )}
          </code>
        </pre>
      )}
    </Highlight>
  )
  if (isMac) {
    return (
      <section className="code__card">
        <section className="code__tools">
          <span className="red code__circle"></span>
          <span className="yellow code__circle"></span>
          <span className="green code__circle"></span>
        </section>
        {codeblock}
      </section>
    )
  } else {
    return codeblock
  }
}

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
