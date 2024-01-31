import React, { useRef, useEffect, memo } from 'react'

import TypeIt from 'typeit'

interface Props {
  pause: () => void
  setCode: (code: string) => void
}

export default memo(function TypeCode({ pause, setCode }: Props) {
  const ref = useRef<HTMLElement>(null)
  const instanceRef = useRef<TypeIt>()
  useEffect(() => {
    if (instanceRef.current || !ref.current) {
      return
    }
    const instance = new TypeIt(ref.current, {
      speed: 50,
      waitUntilVisible: true,
      startDelay: 1000,
      afterStep: () => {
        if (ref.current) {
          setCode(ref.current.innerText.replace('|', ''))
        }
      },
    })
    instanceRef.current = instance

    instanceRef.current
      .type(
        '<span class="token punctuation">##</span><span class="token title important"> 什么是 MDX ？</span>'
      )
      .pause(500)
      .break({ delay: 500 })
      .break({ delay: 500 })
      .type(
        'mdx 是 markdown + jsx 的结合，即可以支持 markdown 语法也可以写自定义组件。'
      )
      .pause(500)
      .break({ delay: 500 })
      .break({ delay: 500 })
      .type('比如： 内置的二维码生成器')
      .pause(500)
      .break({ delay: 500 })
      .break({ delay: 500 })
      .exec(pause)
      .type(`<span class="token punctuation">&lt;</span>`)
      .type('<span class="token tag">QRCodeBlock</span>')
      .type(' ')
      .type('<span class="token punctuation">/&gt;</span>')
      .pause(500)
      .move(-3, { delay: 150 })
      .type('<span class="token attr-name"> url</span>=""')
      .move(-1)
      .type('<span class="token attr-value">https://baidu.com</span>')
      .move(1)
      .type(' <span class="token attr-name">text</span>=""')
      .move(-1, { delay: 150 })
      .type('<span class="token attr-value">长按二维码识别</span>')
      .exec(pause)
      .move(null, { to: 'END' })
      .pause(500)
      .break({ delay: 500 })
      .break({ delay: 500 })
      .pause(3000)
      .type(
        '<span class="token punctuation">##</span><span class="token title important"> 代码片段</span>'
      )

      .break({ delay: 500 })
      .break({ delay: 500 })
      .type(
        '<span class="token punctuation">```</span><br><br><span class="token punctuation">```</span>'
      )
      .move(-5, { delay: 150 })
      .type(`js`)
      .move(1)
      .type(
        `console.<span class="token function">log</span>(<span class="token string">'hello world'</span>);`
      )
      .pause(1000)
      .move(-30, { instant: true, delay: 150 })
      .type(`diff-`)
      .move(3)
      .type(`- `)
      .move(27, { instant: true })
      .type('<br>')
      .type(
        `+ console.<span class="token function">log</span>(<span class="token string">'hello mdx'</span>);`
      )
      .move(null, { to: 'END' })
      .pause(500)
      .break({ delay: 500 })
      .break({ delay: 500 })
      .type('---')
      .type('<br><br>')
      .type('更多功能等你挖掘探索！')

      //.type()
      .go()

    return () => {
      //instance.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <code className="language-markdown" ref={ref}></code>
})
