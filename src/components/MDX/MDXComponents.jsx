/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { getParentPath } from '@/components/utils/file-tree-util'

import { H1, H2, H3, H4 } from './Heading'
import QRCodeBlock from './QRCodeBlock'

// 判断是否为 windows 路径
function isWindowsPath(path) {
  return /^[a-zA-Z]:\\/.test(path)
}

function convertSrc(src) {
  const isRemote = /^https?:\/\/|^data:image\//.test(src)
  if (isRemote) {
    return src
  }
  const baseUrl = JSON.parse(localStorage.getItem('dir-path'))
  if (isWindowsPath(src)) {
    return convertFileSrc('') + src
  }
  // 相对路径
  if (/^\.?\//.test(src)) {
    return (
      convertFileSrc('') +
      `${baseUrl}${src.startsWith('./') ? src.slice(1) : src}`
    )
  }
  // 相对当前文件路径
  const filePath = JSON.parse(localStorage.getItem('filePath'))
  const filePathStr = getParentPath(filePath)
  return convertFileSrc('') + `${filePathStr}${src}`
}

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
  //pre: CodeBlock,
  QRCodeBlock,
  img: (props) => {
    const { src } = props
    const url = convertSrc(src)

    if (!props.alt) {
      return <img {...props} src={url} />
    }
    return (
      <figure>
        <img {...props} style={{ margin: '0 auto' }} src={url} />
        <figcaption>{props.alt}</figcaption>
      </figure>
    )
  },
}
