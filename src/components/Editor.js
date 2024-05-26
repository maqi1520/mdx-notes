import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { onDidChangeTheme, getTheme } from '../utils/theme'
import {
  getOrCreateModel,
  noop,
  pathToLanguage,
  defineTheme,
  setupKeybindings,
  addAction,
  registerDocumentFormattingEditProviders,
} from '../monaco/getOrCreateModel'
import { useUpdateEffect } from 'react-use'
import { open } from '@tauri-apps/api/shell'
import { listenPaste } from '../monaco/pasteImage'

export default function Editor({
  onMount = noop,
  defaultValue = '',
  path,
  onChange,
  onScroll,
}) {
  const editorContainerRef = useRef()
  const editorRef = useRef()
  const subscriptionRef = useRef()
  const scrollSubscriptionRef = useRef()

  useEffect(() => {
    const disposables = []
    defineTheme()

    disposables.push(registerDocumentFormattingEditProviders())

    const language = pathToLanguage(path)
    const defaultModel = getOrCreateModel(defaultValue, language, path)
    const editor = monaco.editor.create(editorContainerRef.current, {
      model: defaultModel,
      fontFamily:
        'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: 14,
      lineHeight: 21,
      minimap: { enabled: false },
      theme: getTheme() === 'dark' ? 'tw-dark' : 'tw-light',
      wordWrap: 'on',
      fixedOverflowWidgets: true,
      unicodeHighlight: {
        ambiguousCharacters: false,
      },
    })
    addAction(editor)

    setupKeybindings(editor)

    editorRef.current = editor

    //粘贴上传图片
    disposables.push(listenPaste(editor))

    disposables.push(editor)

    window.open = (url) => {
      open(url)
    }
    onMount(editor)

    return () => {
      disposables.forEach((disposable) => disposable.dispose())
    }
  }, [])

  useEffect(() => {
    function handleThemeChange(theme) {
      monaco.editor.setTheme(theme === 'dark' ? 'tw-dark' : 'tw-light')
    }
    const dispose = onDidChangeTheme(handleThemeChange)
    return () => dispose()
  }, [])

  // TODO: polyfill?
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.setTimeout(() => editorRef.current.layout(), 0)
    })
    observer.observe(editorContainerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  useUpdateEffect(() => {
    const language = pathToLanguage(path)
    const model = getOrCreateModel(defaultValue, language, path)
    if (model !== editorRef.current?.getModel()) {
      editorRef.current.setModel(model)
    }
  }, [path])

  useEffect(() => {
    subscriptionRef.current && subscriptionRef.current.dispose()
    subscriptionRef.current = editorRef.current.onDidChangeModelContent(
      (event) => {
        onChange(editorRef.current.getValue(), event)
      }
    )
  }, [onChange])

  useEffect(() => {
    scrollSubscriptionRef.current && scrollSubscriptionRef.current.dispose()
    scrollSubscriptionRef.current = editorRef.current.onDidScrollChange((e) => {
      if (!e.scrollTopChanged) return
      const range = editorRef.current.getVisibleRanges()[0]
      const line = range.startLineNumber
      onScroll(line)
    })
  }, [onScroll])

  return (
    <div className="relative flex-auto">
      <div
        ref={editorContainerRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
