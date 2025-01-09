import { useRef, useEffect, useState } from 'react'
import {
  Copy,
  ClipboardPaste,
  TextCursorInput,
  Heading2Icon,
  BoldIcon,
  Link2Icon,
  CodeIcon,
} from 'lucide-react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import CodeMirror from 'codemirror'
import { onDidChangeTheme, getTheme } from '../utils/theme'
import { Button } from './ui/button'
require('codemirror/mode/markdown/markdown')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/css/css')

const docToMode = {
  html: 'markdown',
  css: 'css',
  config: 'javascript',
}

const modeToDoc = {
  markdown: 'html',
  css: 'css',
  javascript: 'config',
}

function EditorToolbar({ editor }) {
  const handleSelectAll = () => {
    editor.execCommand('selectAll')
  }

  const handleCopy = async () => {
    const text = editor.getSelection()
    await navigator.clipboard.writeText(text)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      editor.replaceSelection(text)
    } catch (err) {
      console.error('粘贴失败:', err)
    }
  }

  const insertMarkdown = (type) => {
    const selection = editor.getSelection()
    let text = ''

    switch (type) {
      case 'heading':
        text = selection ? `## ${selection}` : '## 标题'
        break
      case 'bold':
        text = selection ? `**${selection}**` : '**粗体文本**'
        break
      case 'code':
        text = selection ? `\`${selection}\`` : '`代码`'
        break
      case 'link':
        text = selection ? `[${selection}](url)` : '[链接文本](url)'
        break
    }

    editor.replaceSelection(text)

    // 如果没有选中文本，将光标移动到合适的位置
    if (!selection) {
      const cursor = editor.getCursor()
      switch (type) {
        case 'heading':
          editor.setCursor({ line: cursor.line, ch: 3 })
          break
        case 'bold':
          editor.setCursor({ line: cursor.line, ch: 2 })
          break
        case 'code':
          editor.setCursor({ line: cursor.line, ch: 1 })
          break
        case 'link':
          editor.setCursor({ line: cursor.line, ch: 1 })
          break
      }
    }
  }

  return (
    <div className="bg-background border-t absolute z-10 w-full bottom-0 overflow-x-auto whitespace-pre space-x-2 p-2">
      <Button variant="secondary" onClick={handleSelectAll} size="sm">
        <TextCursorInput className="w-4 h-4 mr-1" />
        全选
      </Button>
      <Button variant="secondary" onClick={handleCopy} size="sm">
        <Copy className="w-4 h-4 mr-1" />
        复制
      </Button>
      <Button variant="secondary" onClick={handlePaste} size="sm">
        <ClipboardPaste className="w-4 h-4 mr-1" />
        粘贴
      </Button>
      <Button
        variant="secondary"
        onClick={() => insertMarkdown('heading')}
        size="sm"
      >
        <Heading2Icon className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => insertMarkdown('bold')}
        size="sm"
      >
        <BoldIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => insertMarkdown('code')}
        size="sm"
      >
        <CodeIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => insertMarkdown('link')}
        size="sm"
      >
        <Link2Icon className="w-4 h-4" />
      </Button>
    </div>
  )
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
    if (cmRef.current) return

    cmRef.current = CodeMirror(ref.current, {
      value: initialContent[activeTab],
      mode: docToMode[activeTab],
      lineNumbers: true,
      viewportMargin: Infinity,
      tabSize: 2,
      theme: getTheme(),
      addModeClass: true,
      lineWrapping: true, // 添加这一行来启用自动换行
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
      {cmRef.current && <EditorToolbar editor={cmRef.current} />}
      <div ref={ref} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
