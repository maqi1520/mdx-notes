import { useState } from 'react'
import juice from 'juice/client'
import cheerio from 'cheerio'
import { copyHtml } from './utils/index'
import { useTranslation } from 'react-i18next'
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

export const CopyBtn = ({ resultRef }) => {
  const { t } = useTranslation()
  const [{ state }, setState] = useState({
    state: 'idle',
    errorText: undefined,
  })

  const handleClick = async () => {
    setState({ state: 'loading' })

    const { html, css } = resultRef.current

    //将image url 转换为 base64

    const $ = cheerio.load(html, null, false)

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
  return (
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
  )
}
