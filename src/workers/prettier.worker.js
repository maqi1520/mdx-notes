import prettier from 'prettier/standalone'
import { parse } from '@slidev/parser'

const options = {
  markdown: async () => ({
    parser: 'markdown',
    plugins: [await import('prettier/parser-markdown')],
    printWidth: 10000,
    // 禁用强调符号的规范化，避免 _ 被替换为 *
    proseWrap: 'preserve',
    // 禁用格式化某些元素
    htmlWhitespaceSensitivity: 'ignore',
  }),
  css: async () => ({
    parser: 'css',
    plugins: [await import('prettier/parser-postcss')],
    printWidth: 100,
  }),
  javascript: async () => ({
    parser: 'babel',
    plugins: [await import('prettier/parser-babel')],
    printWidth: 100,
    semi: false,
    singleQuote: true,
  }),
}

let current

addEventListener('message', async (event) => {
  if (event.data._current) {
    current = event.data._current
    return
  }

  function respond(data) {
    setTimeout(() => {
      if (event.data._id === current) {
        postMessage({ _id: event.data._id, ...data })
      } else {
        postMessage({ _id: event.data._id, canceled: true })
      }
    }, 0)
  }

  // 检测是否包含LaTeX公式的函数
  function hasLatexFormulas(text) {
    // 检测行内公式 $...$
    if (/\$[^$\n]+?\$/.test(text)) return true;
    // 检测块级公式 $$...$$
    if (/\$\$[\s\S]*?\$\$/.test(text)) return true;
    // 检测LaTeX环境
    if (/\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/.test(text)) return true;
    return false;
  }

  // 在公式/英文和中文之间添加空格的函数
  function addSpacesBetweenChineseAndFormulas(text) {
    // 定义中文字符的范围
    const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
    
    // 在LaTeX公式和中文之间添加空格
    // 公式后面跟中文
    text = text.replace(/(\$[^$\n]+?\$)([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])/g, '$1 $2');
    // 中文后面跟公式
    text = text.replace(/([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])(\$[^$\n]+?\$)/g, '$1 $2');
    
    // 块级公式和中文之间添加空格
    text = text.replace(/(\$\$[\s\S]*?\$\$)([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])/g, '$1 $2');
    text = text.replace(/([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])(\$\$[\s\S]*?\$\$)/g, '$1 $2');
    
    // 在英文字母/数字和中文之间添加空格
    // 英文后面跟中文
    text = text.replace(/([a-zA-Z0-9])([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])/g, '$1 $2');
    // 中文后面跟英文
    text = text.replace(/([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])([a-zA-Z0-9])/g, '$1 $2');
    
    return text;
  }

  const opts = await options[event.data.language]()

  if (event.data.language === 'markdown') {
    const parsed = parse(event.data.text)

    let pretty = ''
    parsed.slides.forEach((item, i) => {
      if (i > 0) {
        pretty += '\n'
      }
      let index = 0
      const length = Object.keys(item.frontmatter).length
      if (length === 0) {
        pretty += '---\n\n'
      } else {
        for (const key in item.frontmatter) {
          if (Object.hasOwnProperty.call(item.frontmatter, key)) {
            const value = item.frontmatter[key]
            if (value && index === 0) {
              pretty += '---'
            }
            if (value) {
              pretty += `\n${key}: ${value}`
            }
            if (value && index === length - 1) {
              pretty += '\n---\n\n'
            }
            index++
          }
        }
      }

      // 如果内容包含LaTeX公式，则跳过格式化但添加空格
      if (hasLatexFormulas(item.content)) {
        pretty += addSpacesBetweenChineseAndFormulas(item.content)
      } else {
        // 对格式化后的内容也添加空格
        const formatted = prettier.format(item.content, opts)
        pretty += addSpacesBetweenChineseAndFormulas(formatted)
      }
    })
    respond({
      pretty,
    })

    return
  }

  try {
    // 如果是markdown且包含LaTeX公式，跳过格式化但添加空格
    if (event.data.language === 'markdown' && hasLatexFormulas(event.data.text)) {
      respond({
        pretty: addSpacesBetweenChineseAndFormulas(event.data.text),
      })
    } else if (event.data.language === 'markdown') {
      // 对格式化后的markdown也添加空格
      const formatted = prettier.format(event.data.text, opts)
      respond({
        pretty: addSpacesBetweenChineseAndFormulas(formatted),
      })
    } else {
      respond({
        pretty: prettier.format(event.data.text, opts),
      })
    }
  } catch (error) {
    respond({ error })
  }
})
