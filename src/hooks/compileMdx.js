import React from 'react'
import * as runtime from 'react/jsx-runtime'
import * as Babel from '@babel/standalone'
import { compile, nodeTypes, run } from '@mdx-js/mdx'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax/svg'
import rehypeRaw from 'rehype-raw'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeMermaid from 'rehype-mermaid'
import remarkToc from 'remark-toc'
import ReactDOMServer from 'react-dom/server'
import { validateReactComponent } from '../utils/validateJavaScript'
import { MDXComponents } from '../components/MDX/MDXComponents'
import rehypeDivToSection, {
  rehypeAddLineNumbers,
} from '../components/utils/rehype-div'
import { rehypeCodeTitle } from '../components/utils/rehype-code-title'
import reHypeLinkFoot from '../components/utils/rehype-link-foot'

export const Context = React.createContext({ isMac: true })

export const compileMdx = async (
  jsx,
  mdx,
  isMac,
  codeTheme = '',
  formatMarkdown = false,
  raw = false
) => {
  let err = null
  let html = null
  let RootComponents = {}

  if (jsx) {
    try {
      //jsx 先通过编译成js
      let res = Babel.transform(jsx, { presets: ['react'] })
      let code = res.code.replace('export default ', 'return ')

      // eslint-disable-next-line no-new-func
      RootComponents = Function('React', code)(React)
      if (!validateReactComponent(RootComponents)) {
        return {
          error: {
            message: 'not react component',
            file: 'Config',
          },
        }
      }
    } catch (error) {
      return {
        error: {
          message: error,
          file: 'Config',
        },
      }
    }
  }

  // const capture = (name) => (opt) => (tree) => {
  //   file.data[name] = tree;
  // };

  const remarkPlugins = []

  remarkPlugins.push(remarkGfm)
  remarkPlugins.push(remarkFrontmatter)
  remarkPlugins.push(remarkMath)
  // remarkPlugins.push(remarkCodeTitle)
  remarkPlugins.push(() =>
    remarkToc({
      heading: '目录|toc|table[ -]of[ -]contents?',
      maxDepth: 2,
    })
  )

  //remarkPlugins.push(capture('mdast'))

  const file = new VFile({
    basename: formatMarkdown ? 'example.md' : 'example.mdx',
    value: mdx,
  })
  const rehypePlugins = [
    rehypeAddLineNumbers,
    rehypeDivToSection,
    reHypeLinkFoot,
    rehypeMathjax,
    [rehypeMermaid, { strategy: 'img-svg' }],
    [rehypePrismPlus, { ignoreMissing: true, defaultLanguage: 'js' }],
    [rehypeCodeTitle, { isMac }],
  ]
  if (raw) rehypePlugins.unshift([rehypeRaw, { passThrough: nodeTypes }])

  try {
    await compile(file, {
      development: false,
      outputFormat: 'function-body',
      remarkPlugins,
      rehypePlugins,
    })
    const { default: Content } = await run(String(file), {
      ...runtime,
      baseUrl: window.location.href,
    })
    html = ReactDOMServer.renderToString(
      <Context.Provider value={{ isMac, codeTheme }}>
        <section
          data-tool="MDX Notes"
          data-website="https://mdxnotes.com/"
          className={codeTheme}
        >
          <Content components={{ ...MDXComponents, ...RootComponents }} />
        </section>
      </Context.Provider>
    )
  } catch (error) {
    const message =
      error instanceof VFileMessage ? error : new VFileMessage(error)
    message.fatal = true
    if (!file.messages.includes(message)) {
      file.message(message)
    }

    let errorMessage = file.messages[0].message
    err = {
      message: errorMessage,
      file: 'MDX',
    }
  }

  return {
    err,
    html,
  }
}

export function getFrontMatter(md) {
  const match = md.match(/^---.*\r?\n([\s\S]*?)---/)
  const frontmatter = {}
  if (match && match.length > 1) {
    const lines = match[1].split(/\r?\n/)
    lines.forEach((line) => {
      const kv = line.split(':')
      if (kv.length > 1) {
        const key = kv.shift().trim()
        const value = kv.join('').trim()
        frontmatter[key] = value
      }
    })
  }
  return frontmatter
}
