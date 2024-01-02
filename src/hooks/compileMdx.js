import React from 'react'
import * as runtime from 'react/jsx-runtime'
import * as Babel from '@babel/standalone'
import { compile, nodeTypes, run } from '@mdx-js/mdx'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeMermaid from 'rehype-mermaidjs'
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
  formatMarkdown = false
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
  try {
    await compile(file, {
      development: false,
      outputFormat: 'function-body',
      remarkPlugins,
      rehypePlugins: [
        [rehypeRaw, { passThrough: nodeTypes }],
        rehypeAddLineNumbers,
        rehypeDivToSection,
        reHypeLinkFoot,
        rehypeKatex,
        [rehypeMermaid, { strategy: 'img-svg' }],
        [rehypePrismPlus, { ignoreMissing: true, defaultLanguage: 'js' }],
        [rehypeCodeTitle, { isMac }],
      ],
    })
    const { default: Content } = await run(String(file), {
      ...runtime,
      baseUrl: window.location.href,
    })
    html = ReactDOMServer.renderToString(
      <Context.Provider value={{ isMac, codeTheme }}>
        <section
          data-tool="mdx editor"
          data-website="https://editor.runjs.cool/"
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
