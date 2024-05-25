import { useEffect, useState } from 'react'
import juice from 'juice/client'
import cheerio from 'cheerio'
import { copyHtml, makeDoc } from './utils/index'
import { save } from '@tauri-apps/api/dialog'
import { writeTextFile } from '@tauri-apps/api/fs'
import { t } from '@/utils/i18n'
import { Button } from '@/components/ui/button'
import { CopyIcon, Loader2 } from 'lucide-react'

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

export const CopyBtn = ({ previewRef, resultRef }) => {
  const [{ state }, setState] = useState({
    state: 'idle',
    errorText: undefined,
  })

  const handleClick = async () => {
    setState({ state: 'loading' })

    const { html, css } = resultRef.current

    //将image url 转换为 base64

    const $ = cheerio.load(html, null, false)

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
    const htm = $.html()

    const inlineHtml = inlineCSS(htm, css)
    copyHtml(
      inlineHtml
        .replace(/<div/g, '<section')
        .replace(/<\/div>/g, '</section>')
        //暗黑皮肤颜色变量在微信不生效
        .replace(/var\(--weui-BG-0\)/g, '#ededed')
    )

    setState({ state: 'copied' })
    setTimeout(() => {
      setState({ state: 'idle' })
    }, 3000)
  }
  const handleExportHtml = async () => {
    const { html, css, frontMatter = {} } = resultRef.current

    const title = frontMatter.title || 'MDX Editor'
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
    }
  }
  const handleExport = async () => {
    const { frontMatter = {}, md } = resultRef.current
    if (md) {
      const title = frontMatter.title || 'MDX Editor'
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
    }
  }
  useEffect(() => {
    window.handleCopy = handleClick
    window.handleExport = handleExport
    window.handleExportHtml = handleExportHtml
  }, [])
  const handleExportPDF = () => {
    const { md } = resultRef.current
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
      <Button
        size="sm"
        variant="outline"
        onClick={handleClick}
        disabled={
          state === 'copied' || state === 'disabled' || state === 'loading'
        }
      >
        {state === 'loading' ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <CopyIcon className="w-4 h-4 mr-1" />
        )}
        {state === 'copied' ? t('Copy Success') : t('Copy')}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="hidden"
        onClick={handleExport}
      >
        {t('Save As')}
      </Button>
      <Button
        size="sm"
        type="button"
        className="hidden"
        onClick={handleExportPDF}
      >
        导出 PDF
      </Button>
    </>
  )
}
