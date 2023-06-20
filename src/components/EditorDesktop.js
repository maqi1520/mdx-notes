import { useRef, useEffect } from 'react'
import { createMonacoEditor } from '../monaco'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { onDidChangeTheme } from '../utils/theme'

export default function Editor({
  initialContent = {},
  onChange,
  onScroll,
  worker,
  activeTab,
  editorRef: inRef,
}) {
  const editorContainerRef = useRef()
  const editorRef = useRef()
  const editorState = useRef({})

  useEffect(() => {
    const editor = createMonacoEditor({
      container: editorContainerRef.current,
      initialContent,
      onChange,
      worker,
      onScroll,
    })

    editorRef.current = editor
    inRef(editor)

    return () => {
      editorRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    editorRef.current.setOnChange(onChange)
  }, [onChange])

  const initial = useRef(true)
  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    editorRef.current.reset(initialContent)
  }, [initialContent])

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
      window.setTimeout(() => editorRef.current.editor.layout(), 0)
    })
    observer.observe(editorContainerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  // TODO: prevent initial run?
  useEffect(() => {
    const { editor, documents } = editorRef.current
    const currentState = editor.saveViewState()
    const currentModel = editor.getModel()

    if (currentModel === documents.html.getModel()) {
      editorState.current.html = currentState
    } else if (currentModel === documents.css.getModel()) {
      editorState.current.css = currentState
    } else if (currentModel === documents.config.getModel()) {
      editorState.current.config = currentState
    }

    documents[activeTab].activate()
    editor.restoreViewState(editorState.current[activeTab])
    editor.focus()
  }, [activeTab])

  return (
    <div className="relative flex-auto">
      <div
        ref={editorContainerRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
