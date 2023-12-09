import React from 'react'
import {
  Bold,
  Italic,
  Underline,
  Code,
  Code2,
  SplitSquareVertical,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading,
  List,
  ListOrdered,
  ListTodo,
  TextQuote,
  Link,
  Image,
  Table,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'

export default function Header({ editor }) {
  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle>
            <Heading className="w-4 h-4" />
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 }) ? 'bg-primary' : ''
            }
          >
            <Heading1 className="mr-2 h-4 w-4" />
            <span>标题一</span>
            <DropdownMenuShortcut>alt⌘1</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 }) ? 'bg-primary' : ''
            }
          >
            <Heading2 className="mr-2 h-4 w-4" />
            <span>标题二</span>

            <DropdownMenuShortcut>alt⌘2</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 }) ? 'bg-primary' : ''
            }
          >
            <Heading3 className="mr-2 h-4 w-4" />
            <span>标题三</span>

            <DropdownMenuShortcut>alt⌘3</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive('heading', { level: 4 }) ? 'bg-primary' : ''
            }
          >
            <Heading4 className="mr-2 h-4 w-4" />
            <span>标题四</span>
            <DropdownMenuShortcut>alt⌘4</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Toggle
        pressed={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        value="bold"
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        value="italic"
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        value="strikethrough"
        aria-label="Toggle strikethrough"
      >
        <Underline className="h-4 w-4" />
      </Toggle>

      {/* <Toggle
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <Code className="h-4 w-4" />
      </Toggle> */}

      <Toggle
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <Code2 className="h-4 w-4" />
      </Toggle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle>
            <List className="w-4 h-4" />
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <List className="mr-2 h-4 w-4" />
            <span>无序列表</span>
            <DropdownMenuShortcut>⇧⌘7</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <ListOrdered className="mr-2 h-4 w-4" />
            <span>有序列表</span>
            <DropdownMenuShortcut>⇧⌘8</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            <TextQuote className="mr-2 h-4 w-4" />
            <span>区块引用</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'is-active' : ''}
          >
            <ListTodo className="mr-2 h-4 w-4" />
            <span>待办事项</span>
            <DropdownMenuShortcut>⇧⌘9</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <SplitSquareVertical className="mr-2 h-4 w-4" />
            <span>分隔线</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Toggle
        onClick={() =>
          editor
            .chain()
            .focus()
            .setLink({ href: 'https://tiptap.dev/examples/tables' })
            .run()
        }
      >
        <Link className="w-4 h-4" />
      </Toggle>
      <Toggle onClick={addImage}>
        <Image className="w-4 h-4" />
      </Toggle>
      <Toggle
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <Table className="w-4 h-4" />
      </Toggle>

      {/* <Toggle onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </Toggle>
      <Toggle onClick={() => editor.chain().focus().clearNodes().run()}>
        clearNodes
      </Toggle>      
      <Toggle
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </Toggle> */}
    </div>
  )
}
