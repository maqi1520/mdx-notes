/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react'

import { H1, H2, H3, H4 } from './Heading'
import QRCodeBlock from './QRCodeBlock'

export const MDXComponents = {
  wrapper: (props) => (
    <section
      data-tool="mdx 编辑器"
      data-website="https://editor.runjs.cool/"
      className="markdown-body"
      {...props}
    />
  ),
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: (props) => {
    if (props.href && props.href.indexOf('https://mp.weixin.qq.com') > -1) {
      return <a {...props} />
    }
    return <span className="link">{props.children}</span>
  },
  //pre: CodeBlock,
  QRCodeBlock,
  img: (props) => {
    return (
      <figure>
        <img {...props} />
        <figcaption>{props.alt}</figcaption>
      </figure>
    )
  },
}
