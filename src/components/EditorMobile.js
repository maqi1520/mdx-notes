import { useRef, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import CodeMirror from 'codemirror'
import { tailwindcssMode } from '../codemirror/tailwindcssMode'
import { onDidChangeTheme, getTheme } from '../utils/theme'
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/markdown/markdown')
require('codemirror/mode/javascript/javascript')

CodeMirror.defineMode('tailwindcss', tailwindcssMode)

const docToMode = {
  html: 'markdown',
  css: 'tailwindcss',
  config: 'javascript',
}

const modeToDoc = {
  markdown: 'html',
  tailwindcss: 'css',
  javascript: 'config',
}

export default function EditorMobile({
  initialContent,
  onChange,
  activeTab,
  editorRef: inRef,
}) {
  const ref = useRef()
  const cmRef = useRef()
  const content = useRef(initialContent)
  const history = useRef({})
  const [i, setI] = useState(0)
  const skipNextOnChange = useRef(true)
  const initial = useRef(true)

  useEffect(() => {
    cmRef.current = CodeMirror(ref.current, {
      value: initialContent[activeTab],
      mode: docToMode[activeTab],
      lineNumbers: true,
      viewportMargin: Infinity,
      tabSize: 2,
      theme: getTheme(),
      addModeClass: true,
    })
    inRef({
      getValue(doc) {
        return content.current[doc]
      },
    })
  }, [])

  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    content.current = initialContent
    history.current = {}
    cmRef.current.setValue(initialContent[activeTab])
    cmRef.current.clearHistory()
  }, [initialContent])

  useEffect(() => {
    function handleChange() {
      content.current[activeTab] = cmRef.current.getValue()
      if (skipNextOnChange.current) {
        skipNextOnChange.current = false
      } else {
        onChange(activeTab, content.current)
      }
    }
    cmRef.current.on('change', handleChange)
    return () => {
      cmRef.current.off('change', handleChange)
    }
  }, [activeTab, onChange])

  useEffect(() => {
    history.current[modeToDoc[cmRef.current.getOption('mode')]] =
      cmRef.current.getHistory()

    skipNextOnChange.current = true
    cmRef.current.setValue(content.current[activeTab])
    cmRef.current.setOption('mode', docToMode[activeTab])
    if (history.current[activeTab]) {
      cmRef.current.setHistory(history.current[activeTab])
    } else {
      cmRef.current.clearHistory()
    }
    setI((i) => i + 1)
  }, [activeTab])

  useIsomorphicLayoutEffect(() => {
    if (!cmRef.current) return
    cmRef.current.refresh()
    cmRef.current.focus()
  }, [i])

  useEffect(() => {
    function handleThemeChange(theme) {
      cmRef.current.setOption('theme', theme)
    }
    const dispose = onDidChangeTheme(handleThemeChange)
    return () => dispose()
  }, [])

  return (
    <div className="relative flex-auto">
      <div ref={ref} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
