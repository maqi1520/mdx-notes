import React, { useRef, useEffect, useState, useCallback } from 'react'
import TypeIt from 'typeit'

import { themes } from '@/css/markdown-body'
import { compileMdx } from '@/hooks/compileMdx'
import { codeThemes, baseCss } from '@/css/mdx'
import { useDebouncedState } from '@/hooks/useDebouncedState'
import { Preview } from '@/components/Preview'
import { ErrorOverlay } from '@/components/ErrorOverlay'

const theme = {
  markdownTheme: 'default',
  codeTheme: 'okaidia',
  isMac: true,
}

export default function Hero({ children }) {
  const [code, setCode] = useState()
  const ref = useRef()

  const [error, setError, setErrorImmediate] = useDebouncedState(
    undefined,
    1000
  )

  const previewRef = useRef()
  const paused = useRef(false) //暂停
  function pause() {
    paused.current = !paused.current
  }
  useEffect(() => {
    const instance = new TypeIt(ref.current, {
      speed: 50,
      //loop: true,
      waitUntilVisible: true,
      startDelay: 1000,
      afterStep: () => {
        setCode(ref.current.innerText.replace('|', ''))
      },
    })
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
      .move(-3)
      .type('<span class="token attr-name"> url</span>=""')
      .move(-1)
      .type('<span class="token attr-value">https://baidu.com</span>')
      .move(1)
      .type(' <span class="token attr-name">text</span>=""')
      .move(-1)
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
      .move(-5)
      .type(`js`)
      .move(1)
      .type(
        `console.<span class="token function">log</span>(<span class="token string">'hello world'</span>);`
      )
      .pause(1000)
      .move(-30, { instant: true })
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
      instance.destroy()
    }
  }, [])

  const inject = useCallback(async (content) => {
    if (!paused.current) {
      previewRef.current.contentWindow.postMessage(
        { ...content, scrollEnd: true },
        '*'
      )
    }
  }, [])

  useEffect(() => {
    if (code) {
      compileMdx('', code).then((res) => {
        if (res.err) {
          setError(res.err)
        } else {
          setErrorImmediate()
        }
        if (res.html) {
          const { html } = res
          const header = `<h1 class="rich_media_title">一个微信排版编辑器，使用 MDX</h1>
          <div class="rich_media_meta_list">
            <span class="rich_media_meta rich_media_meta_nickname">
              <a
                href="javascript:void(0);"
                class="wx_tap_link js_wx_tap_highlight weui-wa-hotarea"
              >
                JS酷
              </a>
            </span>
            <em class="rich_media_meta rich_media_meta_text">2022-06-29 19:13</em>
          </div>`
          const css = `
          .rich_media_title {
            font-size: 22px;
            line-height: 1.4;
            margin-top: 0;
            margin-bottom: 14px;
        }.rich_media_meta {
          display: inline-block;
          vertical-align: middle;
          margin: 0 10px 10px 0;
          font-size: 15px;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          
      } .rich_media_meta a{
        color: #576b95;
    text-decoration: none;
      } .rich_media_meta_text {
        font-style: normal;
        color: rgba(0,0,0,.3);
    }`
          inject({
            css:
              baseCss +
              themes[theme.markdownTheme].css +
              codeThemes[theme.codeTheme].css +
              css,
            html: header + html,
          })
        }
      })
    }
  }, [code])

  return (
    <div className="grid-cols-1 grid lg:grid-cols-2 relative">
      <div className="mx-auto h-[712px] w-full">
        {children}
        <div className="terminal bg-slate-800  dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10">
          <div className="text-sm opacity-50 text-center text-white border-b border-slate-500/30 leading-relaxed pb-2 -mx-2">
            MDX Editor
          </div>
          <pre style={{ background: 'none' }} className="language-markdown">
            <code className="language-markdown" ref={ref}></code>
          </pre>
        </div>
      </div>

      <div className="mx-auto w-full h-[712px] md:w-[350px] bg-black rounded-[60px] overflow-hidden border-[14px] border-black relative ring ring-purple-400 shadow-xl">
        <div className="relative bg-gray-50 h-full flex flex-col">
          <div className="absolute top-0 inset-x-0">
            <div className="mx-auto bg-black h-6 w-40 rounded-b-3xl"></div>
          </div>
          <div className="pr-8 mt-2 flex justify-end space-x-1 text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
            </svg>
          </div>
          <div className="flex justify-between px-8 py-3 border-b border-b-gray-200 text-black">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </div>
          <div className="flex-auto bg-indigo-200 relative">
            <Preview
              ref={previewRef}
              responsiveSize={{ width: 540, height: 720 }}
            />
            <ErrorOverlay error={error} />
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-20">
          <div className="absolute bottom-1 inset-x-0">
            <div className="mx-auto h-1 w-28 rounded bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
