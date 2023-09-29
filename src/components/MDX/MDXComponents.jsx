/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react'
import { convertFileSrc } from '@tauri-apps/api/tauri'

import { H1, H2, H3, H4 } from './Heading'
import QRCodeBlock from './QRCodeBlock'

export const MDXComponents = {
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
    const { src } = props
    const baseUrl = JSON.parse(localStorage.getItem('dir-path'))
    const isRemote = /^https?:\/\/.+/.test(src)
    const url = isRemote
      ? src
      : convertFileSrc(`${baseUrl}${/^\//.test(src) ? src : '/' + src}`)

    return (
      <figure>
        <img {...props} src={url} />
        <figcaption>{props.alt}</figcaption>
      </figure>
    )
  },
}
