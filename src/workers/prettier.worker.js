import prettier from 'prettier/standalone'
import { parse } from '@slidev/parser'

const options = {
  markdown: async () => ({
    parser: 'markdown',
    plugins: [await import('prettier/parser-markdown')],
    printWidth: 10000,
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

      pretty += prettier.format(item.content, opts)
    })
    respond({
      pretty,
    })

    return
  }

  try {
    respond({
      pretty: prettier.format(event.data.text, opts),
    })
  } catch (error) {
    respond({ error })
  }
})
