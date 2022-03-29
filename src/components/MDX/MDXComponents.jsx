/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react'

import { H1, H2, H3, H4 } from './Heading'
import InlineCode from './InlineCode'
import CodeBlock from './CodeBlock'

const P = (p) => <p className="whitespace-pre-wrap my-4" {...p} />

const Link = (p) => <a className="text-primary-500" {...p} />

const Strong = (strong) => <strong className="font-bold" {...strong} />

const OL = (p) => <ol className="ml-6 my-3 list-decimal" {...p} />
const LI = (p) => <li className="leading-relaxed mb-1" {...p} />
const UL = (p) => <ul className="ml-6 my-3 list-disc" {...p} />

const Divider = () => (
  <hr className="my-6 block border-b border-border dark:border-border-dark" />
)

const Blockquote = ({ children, ...props }) => {
  return (
    <>
      <blockquote className="border-l-4 pl-4 py-1 bg-slate-50" {...props}>
        <span className="block relative">{children}</span>
      </blockquote>
    </>
  )
}

export const MDXComponents = {
  wrapper: (props) => <section className="markdown-body" {...props} />,
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
  pre: CodeBlock,
  img: (props) => {
    return (
      <figure>
        <img {...props} />
        <figcaption>{props.alt}</figcaption>
      </figure>
    )
  },
}
