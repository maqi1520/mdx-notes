import { useState } from 'react'
import clsx from 'clsx'
import juice from 'juice/client'
import { copyHtml, download } from './utils/index'

function inlineCSS(html, css) {
  return juice.inlineContent(html, css, {
    inlinePseudoElements: true,
  })
}

export const CopyBtn = ({ editorRef, previewRef, htmlRef, baseCss }) => {
  const [{ state }, setState] = useState({
    state: 'idle',
    errorText: undefined,
  })

  const handleClick = () => {
    setState({ state: 'loading' })
    const css = baseCss + editorRef.current.getValue('css')
    const html = htmlRef.current
    console.log(htmlRef.current)
    const inlineHtml = inlineCSS(html, css)
    copyHtml(
      inlineHtml.replace(/<div/g, '<section').replace(/<\/div>/g, '</section>')
    )

    setState({ state: 'copied' })
    setTimeout(() => {
      setState({ state: 'idle' })
    }, 1000)
  }
  const handleExport = () => {
    let md = editorRef.current.getValue('html')
    if (md) {
      const title = md.split('\n')[0].replace('# ', '').slice(0, 50)

      download(title + '.mdx', md)
    }
  }
  const handleExportPDF = () => {
    let md = editorRef.current.getValue('html')
    if (md) {
      const title = md.split('\n')[0].replace('# ', '').slice(0, 50)
      document.title = title

      previewRef.current.contentWindow.postMessage(
        {
          print: true,
          title,
        },
        '*'
      )
    }
  }
  return (
    <>
      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3',
          {
            'bg-sky-500/40 text-white dark:bg-gray-800 dark:text-white/40':
              state === 'disabled',
            'cursor-auto':
              state === 'disabled' || state === 'copied' || state === 'loading',
            'hover:bg-sky-400':
              state !== 'disabled' && state !== 'copied' && state !== 'loading',
            'bg-sky-500 text-white': state === 'idle' || state === 'loading',
            'text-sky-500 shadow-copied dark:bg-sky-500/10': state === 'copied',
            'shadow-sm': state !== 'copied',
            'dark:shadow-none': state === 'disabled',
            'dark:shadow-highlight/20':
              state !== 'copied' && state !== 'disabled',
          }
        )}
        onClick={handleClick}
        disabled={
          state === 'copied' || state === 'disabled' || state === 'loading'
        }
      >
        {state === 'copied' ? '复制成功' : '复制'}
      </button>

      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 bg-sky-500 text-white '
        )}
        onClick={handleExport}
      >
        导出 Markdown
      </button>
      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 bg-sky-500 text-white'
        )}
        onClick={handleExportPDF}
      >
        导出 PDF
      </button>
    </>
  )
}
