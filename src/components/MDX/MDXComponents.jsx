/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import React from 'react'
import { convertSrc } from '@/lib/bindings'

import { H1, H2, H3, H4 } from './Heading'
import QRCodeBlock from './QRCodeBlock'
import Blockquote from './Blockquote'

export const MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: (props) => {
    if (props.href && props.href.indexOf('https://mp.weixin.qq.com') > -1) {
      return <a {...props} />
    }
    return (
      <span data-href={props.href} className="link">
        {props.children}
      </span>
    )
  },
  blockquote: Blockquote,
  //pre: CodeBlock,
  QRCodeBlock,
  img: (props) => {
    const { src, alt = '' } = props
    const url = convertSrc(src)

    console.log('props', props)

    const [desc, size = ''] = alt.split('|')
    const [width, height] = size.split(/x/)

    if (!desc) {
      return <img {...props} width={width} height={height} src={url} />
    }
    return (
      <figure>
        <img
          {...props}
          style={{ margin: '0 auto' }}
          width={width}
          height={height}
          src={url}
        />
        <figcaption>{desc}</figcaption>
      </figure>
    )
  },
}
