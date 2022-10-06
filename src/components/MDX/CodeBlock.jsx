import React, { useContext } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
//import theme from 'prism-react-renderer/themes/okaidia'
//import theme from 'prism-react-renderer/themes/vsLight'
import { Context } from '../../hooks/compileMdx'

import Prism from 'prism-react-renderer/prism'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-rust')

function CodeBlock(props) {
  const { isMac = true } = useContext(Context)
  const { children = '', className = 'language-js' } = props.children.props
  // e.g. "language-js"

  let language = className.substring(9)

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

  return (
    <Highlight
      {...defaultProps}
      theme={undefined}
      code={code}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            textAlign: 'left',
            margin: 0,
            padding: 0,
            overflow: 'scroll',
          }}
        >
          {isMac && (
            <section className="code__tools">
              <span className="red code__circle"></span>
              <span className="yellow code__circle"></span>
              <span className="green code__circle"></span>
            </section>
          )}
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
}

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
