import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { debounce } from 'debounce'
import { Editor } from './Editor'
import SplitPane from 'react-split-pane'
import useMedia from 'react-use/lib/useMedia'
import { useDebouncedState } from '../hooks/useDebouncedState'
import { Preview } from './Preview'
import { ErrorOverlay } from './ErrorOverlay'
import Router from 'next/router'
import { Header, HeaderButton } from './Header'
import { Share } from './Share'
import { CopyBtn } from './Copy'
import ThemeDropdown from './ThemeDropdown'
import { TabBar } from './TabBar'
import { themes } from '../css/markdown-body'
import { compileMdx } from '../hooks/compileMdx'
import mdxcss from '../css/mdx'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const DEFAULT_THEME = localStorage.getItem('markdownTheme') || 'default'
const DEFAULT_RESPONSIVE_SIZE = { width: 540, height: 720 }

export default function Pen({
  initialTheme,
  initialContent,
  initialPath,
  initialLayout,
  initialResponsiveSize,
  initialActiveTab,
}) {
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
  const [shouldClearOnUpdate, setShouldClearOnUpdate] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState(initialTheme || DEFAULT_THEME)
  const [responsiveSize, setResponsiveSize] = useState(
    initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE
  )

  useEffect(() => {
    setDirty(true)
  }, [
    activeTab,
    size.layout,
    responsiveSize.width,
    responsiveSize.height,
    responsiveDesignMode,
  ])

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
    setDirty(false)
    if (
      shouldClearOnUpdate &&
      previewRef.current &&
      previewRef.current.contentWindow
    ) {
      previewRef.current.contentWindow.postMessage(
        {
          clear: true,
        },
        '*'
      )
      inject({ html: initialContent.html })
      compileNow({
        html: initialContent.html,
        css: initialContent.css,
        config: initialContent.config,
      })
    }
  }, [initialContent.ID])

  const inject = useCallback(async (content) => {
    previewRef.current.contentWindow.postMessage(content, '*')
  }, [])

  async function compileNow(content) {
    cancelSetError()
    localStorage.setItem(
      initialContent.ID || 'content',
      JSON.stringify(content)
    )
    setIsLoading(true)
    compileMdx(content.config, content.html).then((res) => {
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
          inject({ css: themes[theme].css + mdxcss + css, html })
        }
      }
      setIsLoading(false)
    })
  }

  const compile = useCallback(debounce(compileNow, 200), [theme])

  const onChange = useCallback(
    (document, content) => {
      setDirty(true)
      compile({
        html: content.html,
        css: content.css,
        config: content.config,
      })
    },
    [compile]
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
            current: Math.max(
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
  }, [isLg, setSize, size.layout, activePane])

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

  const onShareStart = useCallback(() => {
    setDirty(false)
  }, [])

  const onShareComplete = useCallback(
    (path) => {
      setShouldClearOnUpdate(false)
      Router.push(path).then(() => {
        setShouldClearOnUpdate(true)
      })
    },
    [size.layout, responsiveDesignMode, responsiveSize]
  )

  const onMarkdownThemeChange = useCallback(
    (value) => {
      inject({
        css: themes[value].css + mdxcss + editorRef.current.getValue('css'),
      })
      window.localStorage.setItem('markdownTheme', value)
      setTheme(value)
    },
    [inject]
  )

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

  return (
    <>
      <Header
        onChangeLayout={(layout) => setSize((size) => ({ ...size, layout }))}
        rightbtn={
          <>
            <ThemeDropdown
              value={theme}
              onChange={onMarkdownThemeChange}
              themes={themes}
            />

            <div className="hidden lg:flex items-center ml-2 rounded-md ring-1 ring-gray-900/5 shadow-sm dark:ring-0 dark:bg-gray-800 dark:shadow-highlight/4">
              <HeaderButton
                isActive={size.layout === 'vertical'}
                label="Switch to vertical split layout"
                onClick={() =>
                  setSize((size) => ({ ...size, layout: 'vertical' }))
                }
              >
                <path
                  d="M12 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9"
                  fill="none"
                />
                <path d="M3 17V5a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2Z" />
              </HeaderButton>
              <HeaderButton
                isActive={size.layout === 'horizontal'}
                label="Switch to horizontal split layout"
                onClick={() =>
                  setSize((size) => ({ ...size, layout: 'horizontal' }))
                }
              >
                <path d="M23 11V3H3v8h20Z" strokeWidth="0" />
                <path
                  d="M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2ZM22 11H4"
                  fill="none"
                />
              </HeaderButton>
              <HeaderButton
                isActive={size.layout === 'preview'}
                label="Switch to preview-only layout"
                onClick={() =>
                  setSize((size) => ({ ...size, layout: 'preview' }))
                }
              >
                <path
                  d="M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
                  fill="none"
                />
              </HeaderButton>
              <HeaderButton
                isActive={responsiveDesignMode}
                label="Toggle responsive design mode"
                onClick={() => setResponsiveDesignMode(!responsiveDesignMode)}
                className="hidden md:block"
              >
                <path
                  d="M15 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a1 1 0 0 0-1 1"
                  fill="none"
                />
                <path d="M12 17V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2Z" />
              </HeaderButton>
            </div>
          </>
        }
      >
        <div className="hidden sm:flex space-x-2">
          <Share
            editorRef={editorRef}
            onShareStart={onShareStart}
            onShareComplete={onShareComplete}
            dirty={dirty}
            initialPath={initialPath}
            layout={size.layout}
            responsiveSize={responsiveDesignMode ? responsiveSize : undefined}
            activeTab={activeTab}
          />
          <CopyBtn
            htmlRef={htmlRef}
            baseCss={themes[theme].css + mdxcss}
            editorRef={editorRef}
            previewRef={previewRef}
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
                    editorRef={(ref) => (editorRef.current = ref)}
                    initialContent={initialContent}
                    onChange={onChange}
                    activeTab={activeTab}
                  />
                )}
              </div>
              <div className="absolute inset-0 w-full h-full">
                <Preview
                  ref={previewRef}
                  responsiveDesignMode={isLg && responsiveDesignMode}
                  responsiveSize={responsiveSize}
                  onChangeResponsiveSize={setResponsiveSize}
                  iframeClassName={resizing ? 'pointer-events-none' : ''}
                  onLoad={() => {
                    inject({
                      html: initialContent.html,
                    })
                    compileNow({
                      css: initialContent.css,
                      config: initialContent.config,
                      html: initialContent.html,
                      ID: initialContent.ID,
                    })
                  }}
                />
                <ErrorOverlay error={error} />
              </div>
            </SplitPane>
          </>
        ) : null}
      </main>
    </>
  )
}
