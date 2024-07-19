import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { layout } from './Layouts'
import { parse } from '@slidev/parser'
import { themes } from '../../css/markdown-body'
import { codeThemes, baseCss } from '../../css/mdx'
import { Context } from './Layouts/Context'

const theme = {
  markdownTheme: 'default',
  codeTheme: 'okaidia',
  isMac: true,
}

interface SlideItem {
  frontmatter: {
    layout: string
  }
}

export interface SlideRef {
  setState: React.Dispatch<
    React.SetStateAction<{
      config: string
      html: string
      css: string
    }>
  >
}

export default forwardRef<SlideRef>(function Preview(props, ref) {
  const [state, setState] = useState({
    config: '',
    html: '',
    css: '',
  })

  useImperativeHandle(
    ref,
    () => ({
      setState,
    }),
    []
  )
  const { html: md, config: js, css } = state
  const [parsed, setParsed] = useState<{ slides: SlideItem[] }>({
    slides: [],
  })

  const slides = parsed.slides

  useEffect(() => {
    let newParse
    if (md) {
      try {
        newParse = parse(md)
      } catch (error) {
        console.log(error)
      }
      if (newParse) {
        setParsed(newParse)
      }
    }
  }, [md])

  return (
    <Context.Provider value={{ js }}>
      <style
        dangerouslySetInnerHTML={{
          __html:
            baseCss +
            themes[theme.markdownTheme].css +
            codeThemes[theme.codeTheme].css +
            css,
        }}
      ></style>
      <div className="flex-auto editable pt-4">
        {slides.map((item, index) => {
          const Slide = layout[item.frontmatter.layout]
            ? layout[item.frontmatter.layout]
            : layout['default']
          return <Slide js={js} item={item} key={index} />
        })}
      </div>
    </Context.Provider>
  )
})
