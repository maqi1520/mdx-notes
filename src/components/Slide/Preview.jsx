import React, { useState, useEffect } from 'react'
import { layout } from './Layouts'
import { parse } from '@slidev/parser'
import { themes } from '../../css/markdown-body'
import { codeThemes, baseCss } from '../../css/mdx'
import { exitFullScreen } from '@/lib/bindings'
import { useRouter } from 'next/router'
import { Context } from './Layouts/Context'

const theme = {
  markdownTheme: 'default',
  codeTheme: 'okaidia',
  isMac: true,
}

export default function Preview({ md = '', js = '', css = '' }) {
  const [current, setCurrent] = useState(0)
  const [parsed, setParsed] = useState({
    slides: [],
  })

  const slides = parsed.slides

  const router = useRouter()

  useEffect(() => {
    async function handle(event) {
      if (event.key === 'Escape') {
        // 退出全屏
        exitFullScreen()

        router.push('/')
      }
    }
    document.addEventListener('keydown', handle)
  }, [])

  useEffect(() => {
    let newParse
    try {
      newParse = parse(md)
    } catch (error) {
      console.log(error)
    }
    if (newParse) {
      setParsed(newParse)
    }
  }, [md])

  useEffect(() => {
    const handleKeydown = (e) => {
      e.preventDefault()
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
      }
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        setCurrent((prev) => (prev > 0 ? prev - 1 : prev))
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [slides.length])

  return (
    <Context.Provider value={{ js }}>
      <div className="h-screen w-screen overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html:
              baseCss +
              themes[theme.markdownTheme].css +
              codeThemes[theme.codeTheme].css +
              css,
          }}
        ></style>
        <div
          className="flex h-full transition-transform transform duration-500"
          style={{
            width: slides.length * 100 + '%',
            transform: `translate(-${100 * current + 'vw'}, 0)`,
          }}
        >
          {slides.map((item, index) => {
            const Slide = layout[item.frontmatter.layout]
              ? layout[item.frontmatter.layout]
              : layout['default']

            return <Slide js={js} item={item} key={index} />
          })}
        </div>
      </div>
    </Context.Provider>
  )
}
