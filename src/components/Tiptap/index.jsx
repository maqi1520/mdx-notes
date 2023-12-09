import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all highlight.js languages
import { lowlight } from 'lowlight'
import React, { useEffect, useState, useImperativeHandle } from 'react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockComponent from './CodeBlock'
import { Markdown } from 'tiptap-markdown'
import Header from './header'
import { PanelLeft } from 'lucide-react'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

const extensions = [
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockComponent)
    },
  }).configure({ lowlight }),
  TaskList,
  TaskItem,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Link.configure({
    linkOnPaste: false,
    openOnClick: false,
  }),
  Image.configure({
    inline: true,
  }),
  Markdown.configure({
    linkify: true,
  }),
]
const Editor = ({ defaultValue = '', onChange, toggleFileTree }, ref) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        // class: 'prose',
      },
    },
    content: defaultValue,
    extensions,
  })

  useImperativeHandle(
    ref,
    () => ({
      setValue: (val) => {
        editor.commands.setContent(val)
      },
    }),
    [editor]
  )

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    // … and get the content after every change.
    editor.on('update', () => {
      onChange(editor.storage.markdown.getMarkdown())
    })
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <div className="pt-6 flex justify-between px-3">
          <PanelLeft onClick={toggleFileTree} className="w-4 h-4" />
          fileName
          <div></div>
        </div>
        <Header editor={editor} />
      </div>
      <div className="prose lg:prose-xl max-w-none p-4 dark:prose-invert flex-auto overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default React.forwardRef(Editor)
