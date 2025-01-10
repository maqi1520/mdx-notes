import { useState } from 'react'
import juice from 'juice/client'
import cheerio from 'cheerio'
import { copyHtml, download, toDataURL } from './utils/index'
import { t } from '@/utils/i18n'
import { Button } from '@/components/ui/button'
import { getFrontMatter } from '@/hooks/compileMdx'
import { CopyIcon, Loader2, PrinterIcon, SaveIcon } from 'lucide-react'

function inlineCSS(html, css) {
  return juice.inlineContent(html, css, {
    inlinePseudoElements: true,
  })
}

export const CopyBtn = ({ editorRef, inject, htmlRef, baseCss }) => {
  const [{ state }, setState] = useState({
    state: 'idle',
    errorText: undefined,
  })

  const handleClick = async () => {
    setState({ state: 'loading' })
    const css = baseCss + editorRef.current.getValue('css')

    //将image url 转换为 base64

    const $ = cheerio.load(htmlRef.current, null, false)

    $('p').each((index, element) => {
      const $element = $(element)
      if ($element.html().trim() === '') {
        $element.remove()
      }
    })

    $('svg use').each((index, element) => {
      const $element = $(element)
      if ($element.attr('href')) {
        const clone = $($element.attr('href')).clone()
        clone.removeAttr('id')
        clone.attr('transform', $element.attr('transform'))
        $element.parent().append(clone)
        $element.remove()
      }
    })
    $('mjx-container svg').each((index, element) => {
      const $element = $(element)
      $element.attr(
        'style',
        `width: ${$element.attr('width')}; height: ${$element.attr(
          'height'
        )}; ${$element.attr('style')}`
      )
      $element.removeAttr('width')
      $element.removeAttr('height')
    })

    $('svg defs').each((index, element) => {
      const $element = $(element)
      $element.remove()
    })

    for (let index = 0; index < $('img').length; index++) {
      const item = $('img')[index]
      const src = item.attribs.src || ''
      if (src.includes('/api/qrcode') || src.includes('data:image/svg+xml')) {
        const dataUrl = await toDataURL(item.attribs.src)
        item.attribs.src = dataUrl
      }
    }
    const html = $.html()

    const inlineHtml = inlineCSS(html, css)
    copyHtml(
      inlineHtml
        .replace(/<div/g, '<section')
        .replace(/<\/div>/g, '</section>')
        //暗黑皮肤颜色变量在微信不生效
        .replace(/var\(--weui-BG-0\)/g, '#fafafa')
    )

    setState({ state: 'copied' })
    setTimeout(() => {
      setState({ state: 'idle' })
    }, 1000)
  }
  const handleExport = () => {
    let md = editorRef.current.getValue('html')
    if (md) {
      const frontMatter = getFrontMatter(md)
      const title = frontMatter.title || 'Untitled'

      download(title + '.md', md)
    }
  }
  const handleExportPDF = () => {
    let md = editorRef.current.getValue('html')
    if (md) {
      inject({
        print: true,
      })
    }
  }
  return (
    <>
      <Button
        size="sm"
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
        className="hidden sm:inline-flex"
        variant="secondary"
        size="sm"
        onClick={handleExport}
      >
        <SaveIcon className="w-4 h-4 mr-1" /> {t('Save As')}
      </Button>
      <Button
        className="hidden sm:inline-flex"
        variant="secondary"
        size="sm"
        type="button"
        onClick={handleExportPDF}
      >
        <PrinterIcon className="w-4 h-4 mr-1" /> {t('Export PDF')}
      </Button>
    </>
  )
}
