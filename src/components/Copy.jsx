import { useEffect, useState } from 'react'
import clsx from 'clsx'
import juice from 'juice/client'
import cheerio from 'cheerio'
import { copyHtml, makeDoc } from './utils/index'
import { save } from '@tauri-apps/api/dialog'
import { writeTextFile } from '@tauri-apps/api/fs'
import { t } from '@/utils/i18n'

function inlineCSS(html, css) {
  return juice.inlineContent(html, css, {
    inlinePseudoElements: true,
  })
}

function toDataURL(src, outputFormat) {
  return new Promise((resolve) => {
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      var canvas = document.createElement('CANVAS')
      var ctx = canvas.getContext('2d')
      var dataURL
      canvas.height = this.naturalHeight
      canvas.width = this.naturalWidth
      ctx.drawImage(this, 0, 0)
      dataURL = canvas.toDataURL(outputFormat)
      resolve(dataURL)
    }
    img.src = src + '&a=1'
    if (img.complete || img.complete === undefined) {
      img.src = src + '&a=2'
    }
  })
}

export const CopyBtn = ({
  editorRef,
  previewRef,
  htmlRef,
  baseCss,
  callback,
}) => {
  const [{ state }, setState] = useState({
    state: 'idle',
    errorText: undefined,
  })

  const handleClick = async () => {
    setState({ state: 'loading' })
    const css = baseCss + editorRef.current.getValue('css')

    //将image url 转换为 base64

    const $ = cheerio.load(htmlRef.current, null, false)

    $('p,section,div').each((index, element) => {
      const $element = $(element)
      if ($element.html().trim() === '') {
        $element.remove()
      }
    })

    for (let index = 0; index < $('img').length; index++) {
      const item = $('img')[index]
      if (item.attribs.src.includes('/api/qrcode')) {
        const dataUrl = await toDataURL(item.attribs.src)
        item.attribs.src = dataUrl
      }
    }
    const html = $.html()

    const inlineHtml = inlineCSS(html, css)
    copyHtml(
      inlineHtml.replace(/<div/g, '<section').replace(/<\/div>/g, '</section>')
    )

    setState({ state: 'copied' })
    setTimeout(() => {
      setState({ state: 'idle' })
    }, 1000)
  }
  const handleExportHtml = async () => {
    const css = baseCss + editorRef.current.getValue('css')
    const html = htmlRef.current
    let md = editorRef.current.getValue('html')

    const title = md
      ? md.split('\n')[0].replace('# ', '').slice(0, 50)
      : 'MDX Editor'
    if (html) {
      const doc = makeDoc(title, html, css)
      const filePath = await save({
        title: t('Save'),
        filters: [
          {
            name: title,
            extensions: ['html'],
          },
        ],
      })

      //download(title + '.mdx', md)
      if (filePath) {
        await writeTextFile(filePath, doc)
      }
      callback(filePath)
    }
  }
  const handleExport = async () => {
    let md = editorRef.current.getValue('html')
    if (md) {
      const title = md.split('\n')[0].replace('# ', '').slice(0, 50)
      const filePath = await save({
        title: t('Save'),
        filters: [
          {
            name: title,
            extensions: ['md', 'mdx'],
          },
        ],
      })

      //download(title + '.mdx', md)
      if (filePath) {
        await writeTextFile(filePath, md)
      }
      callback(filePath)
    }
  }
  useEffect(() => {
    window.handleCopy = handleClick
    window.handleExport = handleExport
    window.handleExportHtml = handleExportHtml
  }, [])
  const handleExportPDF = () => {
    let md = editorRef.current.getValue('html')
    if (md) {
      previewRef.current.contentWindow.postMessage(
        {
          print: true,
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
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 min-w-[76px]',
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
        {state === 'copied' ? t('Copy Success') : t('Copy')}
      </button>

      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 bg-sky-500 text-white min-w-[76px]'
        )}
        onClick={handleExport}
      >
        {t('Save As')}
      </button>
      <button
        type="button"
        className={clsx(
          'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 bg-sky-500 text-white hidden'
        )}
        onClick={handleExportPDF}
      >
        导出 PDF
      </button>
    </>
  )
}
