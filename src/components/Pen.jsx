'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { debounce } from 'debounce'
import Editor from './EditorDesktop'
import SplitPane from 'react-split-pane'
import Count from 'word-count'
import useMedia from 'react-use/lib/useMedia'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { useDebouncedState } from '../hooks/useDebouncedState'
import { Preview } from './Preview'
import { ErrorOverlay } from './ErrorOverlay'
import { useRouter } from 'next/navigation'
import { Header } from './Header'
import { Button } from '@/components/ui/button'
import { CopyBtn } from './Copy'
import ThemeDropdown from './ThemeDropdown'
import { TabBar } from './TabBar'
import { themes } from '../css/markdown-body'
import { compileMdx, getFrontMatter } from '../hooks/compileMdx'
import { baseCss, codeThemes } from '../css/mdx'
import {
  PenSquare,
  Columns,
  MonitorSmartphone,
  Square,
  GitForkIcon,
} from 'lucide-react'

import clsx from 'clsx'
import { useGlobalValue } from '@/hooks/useGlobalValue'
import { postData } from '@/utils/helpers'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const DEFAULT_RESPONSIVE_SIZE = { width: 360, height: 720 }

export default function Pen({
  id,
  initialContent,
  initialLayout,
  initialResponsiveSize,
  initialActiveTab,
}) {
  const [globalValue] = useGlobalValue()
  const currentUserId = globalValue.user?._id
  const author_id = initialContent.author_id
  const router = useRouter()
  const htmlRef = useRef()
  const previewRef = useRef()
  const [size, setSize] = useState({ percentage: 0.5, layout: initialLayout })
  const [resizing, setResizing] = useState(false)
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [activePane, setActivePane] = useState(
    initialLayout === 'preview' ? 'preview' : 'editor'
  )
  const isLg = useMedia('(min-width: 1024px)')
  const [dirty, setDirty] = useState(false)
  const [renderEditor, setRenderEditor] = useState(false)
  const [error, setError, setErrorImmediate, cancelSetError] =
    useDebouncedState(undefined, 1000)
  const editorRef = useRef()
  const [responsiveDesignMode, setResponsiveDesignMode] = useState(
    initialResponsiveSize ? true : false
  )
  const [isLoading, setIsLoading] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [theme, setTheme] = useLocalStorage('editor-theme', {
    markdownTheme: 'default',
    codeTheme: 'default',
    isMac: true,
  })
  const [responsiveSize, setResponsiveSize] = useState(
    initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE
  )

  useEffect(() => {
    if (dirty) {
      function handleUnload(e) {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', handleUnload)
      return () => {
        window.removeEventListener('beforeunload', handleUnload)
      }
    }
  }, [dirty])

  useEffect(() => {
    compileNow({
      html: initialContent.html,
      css: initialContent.css,
      config: initialContent.config,
    })
  }, [initialContent])

  const inject = useCallback(async (content) => {
    previewRef.current && previewRef.current.setState(content)
  }, [])

  async function compileNow(content) {
    cancelSetError()
    setIsLoading(true)
    compileMdx(
      content.config,
      content.html,
      theme.isMac,
      theme.codeTheme,
      theme.formatMarkdown
    ).then((res) => {
      if (res.err) {
        setError(res.err)
      } else {
        setErrorImmediate()
      }
      if (res.html) {
        const { html } = res
        const { css } = content
        if (css || html) {
          //编译后的html保存到ref 中
          htmlRef.current = html
          inject({
            css:
              baseCss +
              themes[theme.markdownTheme].css +
              codeThemes[theme.codeTheme].css +
              css,
            html,
            codeTheme: theme.codeTheme,
          })
        }
      }
      setWordCount(Count(content.html || ''))
      setIsLoading(false)
    })
  }

  async function handleFork() {
    const frontMatter = getFrontMatter(initialContent.html)
    const title = frontMatter.title || 'Untitled'
    const data = await postData({
      url: `/api/posts`,
      data: {
        title,
        ...initialContent,
      },
    })
    router.push(`/post?id=${data.data.id}`)
  }

  async function updatePost(content) {
    // demo 也保存到本地
    if (id === 'demo') {
      localStorage.setItem('content', JSON.stringify(content))
      setDirty(false)
      return
    }
    if (!currentUserId) {
      return
    }
    const frontMatter = getFrontMatter(content.html)
    const title = frontMatter.title || 'Untitled'
    const res = await postData({
      url: `/api/user/update_post`,
      data: {
        id,
        title,
        ...content,
      },
    })
    setDirty(false)
  }

  const compile = useCallback(debounce(compileNow, 200), [theme])
  const handleUpdate = useCallback(debounce(updatePost, 1000), [
    id,
    currentUserId,
  ])

  const onChange = useCallback(
    (document, content) => {
      setDirty(true)
      if (id) {
        handleUpdate(content)
      }
      compile({
        html: content.html,
        css: content.css,
        config: content.config,
      })
    },
    [compile, id, handleUpdate]
  )

  useIsomorphicLayoutEffect(() => {
    function updateSize() {
      setSize((size) => {
        const windowSize =
          size.layout === 'horizontal'
            ? document.documentElement.clientHeight - HEADER_HEIGHT
            : document.documentElement.clientWidth

        if (isLg && size.layout !== 'preview') {
          const min = size.layout === 'vertical' ? 320 : 320 + TAB_BAR_HEIGHT
          const max =
            size.layout === 'vertical'
              ? windowSize - min - RESIZER_SIZE
              : windowSize - 320 - RESIZER_SIZE

          return {
            ...size,
            min,
            max,
            current:
              size.layout === 'editor'
                ? document.documentElement.clientWidth
                : Math.max(
                    Math.min(Math.round(windowSize * size.percentage), max),
                    min
                  ),
          }
        }

        const newSize =
          (isLg && size.layout !== 'preview') ||
          (!isLg && activePane === 'editor')
            ? windowSize
            : 0

        return {
          ...size,
          current: newSize,
          min: newSize,
          max: newSize,
        }
      })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [isLg, size.layout, activePane])

  useEffect(() => {
    if (isLg) {
      if (size.layout !== 'preview') {
        setRenderEditor(true)
      }
    } else if (activePane === 'editor') {
      setRenderEditor(true)
    }
  }, [activePane, isLg, size.layout])

  useEffect(() => {
    if (resizing) {
      document.body.classList.add(
        size.layout === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    } else {
      document.body.classList.remove(
        size.layout === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    }
  }, [resizing])

  const updateCurrentSize = useCallback((newSize) => {
    setSize((size) => {
      const windowSize =
        size.layout === 'vertical'
          ? document.documentElement.clientWidth
          : document.documentElement.clientHeight - HEADER_HEIGHT
      const percentage = newSize / windowSize
      return {
        ...size,
        current: newSize,
        percentage:
          percentage === 1 || percentage === 0 ? size.percentage : percentage,
      }
    })
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      compileNow({
        html: editorRef.current.getValue('html'),
        css: editorRef.current.getValue('css'),
        config: editorRef.current.getValue('config'),
      })
    }
  }, [theme])

  // initial state resets
  useEffect(() => {
    setSize((size) => ({ ...size, layout: initialLayout }))
  }, [initialLayout])
  useEffect(() => {
    setResponsiveDesignMode(Boolean(initialResponsiveSize))
    setResponsiveSize(initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE)
  }, [initialResponsiveSize])
  useEffect(() => {
    setActiveTab(initialActiveTab)
  }, [initialActiveTab])

  // useEffect(() => {
  //   const handleMessage = (e) => {
  //     if (e.data.event === 'preview-scroll') {
  //       console.log(e.data)
  //       editorRef.current.editor.revealLine(e.data.line)
  //     }
  //   }
  //   window.addEventListener('message', handleMessage, false)
  // }, [])

  return (
    <div className="flex h-screen flex-col">
      <Header
        rightBtn={
          <>
            <ThemeDropdown
              value={theme}
              onChange={setTheme}
              themes={themes}
              codeThemes={codeThemes}
            />

            <div className="hidden lg:flex items-center ml-2 rounded-md bg-secondary border">
              <Button
                className="border-0 rounded-none"
                size="icon"
                variant="secondary"
                onClick={() =>
                  setSize((size) => ({ ...size, layout: 'vertical' }))
                }
              >
                <Columns
                  className={clsx('w-5 h-5', {
                    'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                      size.layout === 'vertical',
                  })}
                />
              </Button>
              <Button
                className="border-0 rounded-none"
                size="icon"
                variant="secondary"
                onClick={() =>
                  setSize((size) => ({
                    ...size,
                    layout: 'editor',
                  }))
                }
              >
                <PenSquare
                  className={clsx('w-5 h-5', {
                    'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                      size.layout === 'editor',
                  })}
                />
              </Button>
              <Button
                className="border-0 rounded-none"
                size="icon"
                variant="secondary"
                onClick={() =>
                  setSize((size) => ({ ...size, layout: 'preview' }))
                }
              >
                <Square
                  className={clsx('w-5 h-5', {
                    'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                      size.layout === 'preview',
                  })}
                />
              </Button>
              <Button
                className="border-0 rounded-none"
                size="icon"
                variant="secondary"
                onClick={() => setResponsiveDesignMode(!responsiveDesignMode)}
              >
                <MonitorSmartphone
                  className={clsx('w-5 h-5', {
                    'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                      responsiveDesignMode,
                  })}
                />
              </Button>
            </div>
          </>
        }
      >
        <div className="hidden sm:flex space-x-2">
          {author_id !== currentUserId && (
            <Button size="sm" onClick={handleFork}>
              <GitForkIcon className="w-4 h-4 mr-1" />
              Fork
            </Button>
          )}
          <CopyBtn
            htmlRef={htmlRef}
            baseCss={
              baseCss +
              themes[theme.markdownTheme].css +
              codeThemes[theme.codeTheme].css
            }
            editorRef={editorRef}
            inject={inject}
          />
        </div>
      </Header>
      <main className="flex-auto relative border-t border-gray-200 dark:border-gray-800">
        {initialContent && typeof size.current !== 'undefined' ? (
          <>
            {(!isLg || size.layout !== 'preview') && (
              <TabBar
                width={
                  size.layout === 'vertical' && isLg ? size.current : '100%'
                }
                isLoading={isLoading}
                wordCount={wordCount}
                showPreviewTab={!isLg}
                activeTab={
                  isLg || activePane === 'editor' ? activeTab : 'preview'
                }
                onChange={(tab) => {
                  if (tab === 'preview') {
                    setActivePane('preview')
                  } else {
                    setActivePane('editor')
                    setActiveTab(tab)
                  }
                }}
              />
            )}
            <SplitPane
              split={size.layout === 'horizontal' ? 'horizontal' : 'vertical'}
              minSize={size.min}
              maxSize={size.max}
              size={size.current}
              onChange={updateCurrentSize}
              paneStyle={{ marginTop: -1 }}
              pane1Style={{ display: 'flex', flexDirection: 'column' }}
              onDragStarted={() => setResizing(true)}
              onDragFinished={() => setResizing(false)}
              allowResize={isLg && size.layout !== 'preview'}
              resizerClassName={
                isLg && size.layout !== 'preview'
                  ? 'Resizer'
                  : 'Resizer-collapsed'
              }
            >
              <div className="border-t border-gray-200 dark:border-white/10 mt-12 flex-auto flex">
                {renderEditor && (
                  <Editor
                    readOnly={currentUserId !== author_id && id !== 'demo'}
                    editorRef={(ref) => (editorRef.current = ref)}
                    initialContent={initialContent}
                    onChange={onChange}
                    onScroll={(line) => {
                      inject({ line })
                    }}
                    activeTab={activeTab}
                  />
                )}
              </div>
              <div className="absolute inset-0 w-full md:h-full top-12 lg:top-0 border-t border-gray-200 dark:border-white/10 lg:border-0 bg-gray-50 dark:bg-black">
                <Preview
                  ref={previewRef}
                  responsiveDesignMode={
                    size.layout !== 'editor' && isLg && responsiveDesignMode
                  }
                  responsiveSize={responsiveSize}
                  onChangeResponsiveSize={setResponsiveSize}
                  iframeClassName={resizing ? 'pointer-events-none' : ''}
                />
                <ErrorOverlay value={theme} onChange={setTheme} error={error} />
              </div>
            </SplitPane>
          </>
        ) : null}
      </main>
    </div>
  )
}
