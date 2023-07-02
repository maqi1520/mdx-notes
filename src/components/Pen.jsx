import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { debounce } from 'debounce'
import { Editor } from './Editor'
import SplitPane from 'react-split-pane'
import Count from 'word-count'
import useMedia from 'react-use/lib/useMedia'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { useDebouncedState } from '../hooks/useDebouncedState'
import { Preview } from './Preview'
import { ErrorOverlay } from './ErrorOverlay'
import { useRouter } from 'next/router'
import Header, { HeaderButton } from './Header'
import { LogoHome } from './Logo'
import { Share } from './Share'
import { CopyBtn } from './Copy'
import ThemeDropdown from './ThemeDropdown'
import { TabBar } from './TabBar'
import { themes } from '../css/markdown-body'
import { compileMdx } from '../hooks/compileMdx'
import { baseCss, codeThemes } from '../css/mdx'
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs'
import { listen } from '@tauri-apps/api/event'
import { FileTree } from './FileTree'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const DEFAULT_RESPONSIVE_SIZE = { width: 360, height: 720 }

export default function Pen({
  initialContent,
  initialPath,
  initialLayout,
  initialResponsiveSize,
  initialActiveTab,
}) {
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
  const [dirty, setDirty] = useState(false) //是否修改过
  const [renderEditor, setRenderEditor] = useState(false)
  const [error, setError, setErrorImmediate, cancelSetError] =
    useDebouncedState(undefined, 1000)
  const editorRef = useRef()
  const [responsiveDesignMode, setResponsiveDesignMode] = useState(
    initialResponsiveSize ? true : false
  )
  const [shouldClearOnUpdate, setShouldClearOnUpdate] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showFileTree, setShowFileTree] = useState(false)
  const [fileTreeSize, setFileTreeSize] = useLocalStorage('file-tree-size', 250)
  const [theme, setTheme] = useLocalStorage('editor-theme', {
    markdownTheme: 'default',
    codeTheme: 'default',
    isMac: true,
  })
  const [responsiveSize, setResponsiveSize] = useState(
    initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE
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

  const refFileTree = useRef()
  const [filePath, setFilePath] = useState()
  const readMarkdown = (path) => {
    if (/\.mdx?$/.test(path)) {
      setFilePath(path)
      readTextFile(path).then((res) => {
        setTimeout(() => {
          editorRef.current.documents.html.getModel().setValue(res)
          editorRef.current.editor.revealLine(1)
        }, 10)
        //editorRef.current.editor.getModel().setValue(res)
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

  const inject = useCallback(async (content) => {
    previewRef.current.contentWindow.postMessage(content, '*')
  }, [])

  async function compileNow(content) {
    cancelSetError()
    setIsLoading(true)
    compileMdx(content.config, content.html, theme.isMac, theme.codeTheme).then(
      (res) => {
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
      }
    )
  }

  const compile = useCallback(
    debounce((content) => {
      compileNow(content)
      if (filePath) {
        writeTextFile(filePath, content.html).then(() => {
          setDirty(false)
        })
      } else {
        setDirty(true)
      }
      localStorage.setItem(
        initialContent._id || 'content',
        JSON.stringify(content)
      )
    }, 200),
    [theme, filePath, initialContent._id]
  )

  useEffect(() => {
    setDirty(false)
    if (
      shouldClearOnUpdate &&
      previewRef.current &&
      previewRef.current.contentWindow
    ) {
      inject({ html: initialContent.html })
      compileNow({
        html: initialContent.html,
        css: initialContent.css,
        config: initialContent.config,
      })
    }
  }, [initialContent._id])

  const onChange = useCallback(
    (document, content) => {
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
        const documentWidth = document.documentElement.clientWidth
        const mainWidth = showFileTree
          ? documentWidth - fileTreeSize
          : documentWidth

        const windowSize =
          size.layout === 'horizontal'
            ? document.documentElement.clientHeight - HEADER_HEIGHT
            : mainWidth

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
                ? mainWidth
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
  }, [isLg, size.layout, activePane, showFileTree, fileTreeSize])

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

  const updateCurrentSize = useCallback(
    (newSize) => {
      setSize((size) => {
        const documentWidth = document.documentElement.clientWidth
        const mainWidth = showFileTree
          ? documentWidth - fileTreeSize
          : documentWidth
        const windowSize =
          size.layout === 'vertical'
            ? mainWidth
            : document.documentElement.clientHeight - HEADER_HEIGHT
        const percentage = newSize / windowSize
        return {
          ...size,
          current: newSize,
          percentage:
            percentage === 1 || percentage === 0 ? size.percentage : percentage,
        }
      })
    },
    [showFileTree, fileTreeSize]
  )

  const onShareStart = useCallback(() => {
    setDirty(false)
  }, [])

  const onShareComplete = useCallback(
    (path) => {
      setShouldClearOnUpdate(false)
      router.push(path).then(() => {
        setShouldClearOnUpdate(true)
      })
    },
    [size.layout, responsiveDesignMode, responsiveSize]
  )

  useEffect(() => {
    if (editorRef.current) {
      compileNow({
        html: editorRef.current.getValue('html'),
        css: editorRef.current.getValue('css'),
        config: editorRef.current.getValue('config'),
      })
    }
  }, [theme])

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
    <SplitPane
      minSize={160}
      maxSize={500}
      size={showFileTree ? fileTreeSize : 0}
      onChange={setFileTreeSize}
    >
      <FileTree
        selectedPath={filePath}
        onSelect={readMarkdown}
        ref={refFileTree}
      />
      <div className="h-full flex flex-col">
        <Header
          logo={
            <LogoHome
              className={showFileTree ? 'text-sky-500' : ''}
              onClick={() => setShowFileTree((v) => !v)}
            />
          }
          rightbtn={
            <>
              <ThemeDropdown
                value={theme}
                onChange={setTheme}
                themes={themes}
                codeThemes={codeThemes}
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
                  isActive={size.layout === 'editor'}
                  label="Switch to preview-only layout"
                  onClick={() =>
                    setSize((size) => ({
                      ...size,
                      layout: 'editor',
                    }))
                  }
                >
                  <path
                    fill="none"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
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
              baseCss={
                baseCss +
                themes[theme.markdownTheme].css +
                codeThemes[theme.codeTheme].css
              }
              editorRef={editorRef}
              previewRef={previewRef}
              callback={(path) => {
                setFilePath(path)
                refFileTree.current.reload()
              }}
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
                  dirty={dirty}
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
                    onLoad={() => {
                      inject({
                        html: initialContent.html,
                      })
                      compileNow({
                        css: initialContent.css,
                        config: initialContent.config,
                        html: initialContent.html,
                        ID: initialContent._id,
                      })
                    }}
                  />
                  <ErrorOverlay error={error} />
                </div>
              </SplitPane>
            </>
          ) : null}
        </main>
      </div>
    </SplitPane>
  )
}
