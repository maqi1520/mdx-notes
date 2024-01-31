'use client'
import React, { useEffect, useRef } from 'react'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default function Editor() {
  const ref = useRef()
  const editorRef = useRef()
  useEffect(() => {
    if (editorRef.current) return
    console.log(123)
    editorRef.current = monaco.editor.create(ref.current, {
      value: 'console.log("Hello, world!")',
      language: 'javascript',
      theme: 'vs-dark',
    })

    return () => {}
  }, [])

  return <div style={{ height: 800 }} ref={ref}></div>
}
