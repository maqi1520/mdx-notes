import React, { useState, useRef, useEffect, useCallback } from 'react'
import SplitPane from 'react-split-pane'
import { useRouter } from 'next/router'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { confirm } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'
import { listen } from '@tauri-apps/api/event'
import FileTree from './FileTree'
import Tiptap from './Tiptap'

import { t } from '@/utils/i18n'

export default function Main() {
  const router = useRouter()
  const query = router.query
  const [resizing, setResizing] = useState(false)
  const editorRef = useRef()

  const [dirty, setDirty] = useState(false) //是否修改过
  const [showFileTree, setShowFileTree] = useState(false)
  const [fileTreeSize, setFileTreeSize] = useLocalStorage('file-tree-size', 250)

  const refFileTree = useRef()
  const [filePath, setFilePath] = useLocalStorage('filePath')
  const readMarkdown = async (path) => {
    if (/\.mdx?$/.test(path)) {
      if (dirty) {
        const confirmed = await confirm(
          t("If you don't save, your changes will be lost"),
          {
            title: t('The current file is not saved'),
            type: 'warning',
          }
        )
        if (!confirmed) return
      }
      setFilePath(path)
      if (query.id) {
        router.replace('/')
        return
      }

      readTextFile(path).then((res) => {
        // set editor value
        editorRef.current.setValue(res)
      })
    }
  }
  const handleDrop = useCallback(async () => {
    listen('tauri://file-drop', async (event) => {
      refFileTree.current.setDirPath(event.payload[0])
      readMarkdown(event.payload[0])
    })
  }, [])

  useEffect(() => {
    handleDrop()
  }, [handleDrop])

  const handleShowPPT = useCallback(() => {
    const slideContent = {
      html: editorRef.current.getValue('html'),
      css: editorRef.current.getValue('css'),
      config: editorRef.current.getValue('config'),
    }
    localStorage.setItem('slide', JSON.stringify(slideContent))
    router.push('/slide')
  }, [])

  return (
    <SplitPane
      className={resizing ? '' : 'file-tree-wrapper'}
      minSize={160}
      maxSize={500}
      size={showFileTree ? fileTreeSize : 0}
      onDragStarted={() => setResizing(true)}
      onDragFinished={() => setResizing(false)}
      onChange={setFileTreeSize}
    >
      <FileTree
        showFileTree={showFileTree}
        selectedPath={filePath}
        onSelect={readMarkdown}
        ref={refFileTree}
        setShowPPT={handleShowPPT}
      />
      <Tiptap
        ref={editorRef}
        onChange={(value) => {
          console.log(value)
        }}
        toggleFileTree={() => setShowFileTree(!showFileTree)}
      />
    </SplitPane>
  )
}
