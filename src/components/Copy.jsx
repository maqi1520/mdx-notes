import { useState, useImperativeHandle, forwardRef } from 'react'
import clsx from 'clsx'
import juice from 'juice/client'
import { copyHtml, download } from './utils/index'

function inlineCSS(html, css) {
  return juice.inlineContent(html, css, {
    inlinePseudoElements: true,
  })
}

export const CopyBtn = forwardRef(function ({ editorRef, previewRef }, ref) {
  const [{ state, html, css }, setState] = useState({
    state: 'disabled',
    errorText: undefined,
    html: undefined,
    css: undefined,
  })

  useImperativeHandle(
    ref,
    () => ({
      set: ({ html, css }) => {
        setState((prev) => ({
          ...prev,
          html,
          css,
          state: 'idle',
        }))
      },
    }),
    []
  )

  const handleClick = () => {
    setState({ state: 'loading' })
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
    <div className="hidden sm:flex items-center space-x-4 min-w-0">
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
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 bg-sky-500 text-white ml-2'
        )}
        onClick={handleExport}
      >
        导出 Markdown
      </button>
      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 bg-sky-500 text-white ml-2'
        )}
        onClick={handleExportPDF}
      >
        导出 PDF
      </button>
    </div>
  )
})
