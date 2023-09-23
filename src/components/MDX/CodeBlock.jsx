import React, { useContext } from 'react'
import { Context } from '../../hooks/compileMdx'

function CodeBlock({ children, ...other }) {
  const { isMac = true } = useContext(Context)

  return (
    <pre {...other}>
      {isMac && (
        <section className="code__tools">
          <span className="red code__circle"></span>
          <span className="yellow code__circle"></span>
          <span className="green code__circle"></span>
        </section>
      )}
      <pre style={{ margin: 0 }}>{children}</pre>
    </pre>
  )
}

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
