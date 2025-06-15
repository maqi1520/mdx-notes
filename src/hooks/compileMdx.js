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
import remarkTocHeadings from '../components/utils/remark-toc-headings'
import addDoubleBracketsLinks from '../components/utils/remark-double-brackets-link'
import { rehypeCodeTitle } from '../components/utils/rehype-code-title'
import reHypeLinkFoot from '../components/utils/rehype-link-foot'

// 解析 frontmatter 的工具函数
export function getFrontMatter(md = '') {
  const match = md.match(/^---.*\r?\n([\s\S]*?)---/)
  const frontmatter = {}
  if (match && match.length > 1) {
    const lines = match[1].split(/\r?\n/)
    let currentKey = null
    
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      if (trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':')
        const key = trimmedLine.substring(0, colonIndex).trim()
        const value = trimmedLine.substring(colonIndex + 1).trim()
        
        if (value) {
          // 如果同一行有值
          frontmatter[key] = value
          currentKey = null
        } else {
          // 如果是嵌套对象的开始
          frontmatter[key] = {}
          currentKey = key
        }
      } else if (currentKey && trimmedLine.includes(':')) {
        // 处理嵌套属性
        const colonIndex = trimmedLine.indexOf(':')
        const nestedKey = trimmedLine.substring(0, colonIndex).trim()
        const nestedValue = trimmedLine.substring(colonIndex + 1).trim()
        frontmatter[currentKey][nestedKey] = nestedValue
      }
    })
  }
  return frontmatter
}

export const Context = React.createContext({ isMac: true })

// 创建一个 rehype 插件，在 HTML AST 阶段为数学公式添加 displaystyle
function rehypeMathDisplaystyle(mdxContent) {
  const frontmatter = getFrontMatter(mdxContent)
  const forceDisplaystyle = frontmatter?.math?.forceDisplaystyle === 'true' || frontmatter?.displaystyle === 'true'
  
  return function() {
    return function transformer(tree) {
      if (!forceDisplaystyle) return
      
      function visit(node) {
        // 查找数学公式的 code 元素
        if (node.type === 'element' && 
            node.tagName === 'code' && 
            node.properties && 
            node.properties.className &&
            Array.isArray(node.properties.className) &&
            node.properties.className.includes('language-math')) {
          
          // 查找文本子节点
          if (node.children && node.children.length > 0) {
            const textNode = node.children[0]
            if (textNode && textNode.type === 'text' && textNode.value) {
              if (!textNode.value.trim().startsWith('\\displaystyle')) {
                textNode.value = `\\displaystyle ${textNode.value}`
              }
            }
          }
        }
        
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(visit)
        }
      }
      
      visit(tree)
    }
  }
}

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
  const toc = []

  const remarkPlugins = []

  remarkPlugins.push(remarkGfm)
  remarkPlugins.push(remarkFrontmatter)
  remarkPlugins.push(remarkMath)
  remarkPlugins.push(addDoubleBracketsLinks)
  remarkPlugins.push([
    remarkTocHeadings,
    {
      exportRef: toc,
    },
  ])
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
    rehypeMathDisplaystyle(mdx), // 在 MathJax 之前修改数学公式
    rehypeMathjax, // MathJax 渲染
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
    html = ReactDOMServer.renderToStaticMarkup(
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
    toc,
    html,
  }
}
