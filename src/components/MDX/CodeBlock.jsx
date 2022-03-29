import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsDark'

function CodeBlock(props) {
  const { children = '', className = 'language-js' } = props.children.props
  // e.g. "language-js"

  const language = className.substring(9)
  return (
    <section className="code__card">
      <section className="code__tools">
        <span className="red code__circle"></span>
        <span className="yellow code__circle"></span>
        <span className="green code__circle"></span>
      </section>
      <section className="code__card__content">
        <Highlight
          {...defaultProps}
          theme={theme}
          code={children}
          language={language}
        >
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
                      <span key={i}>
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
      </section>
    </section>
  )
}

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
