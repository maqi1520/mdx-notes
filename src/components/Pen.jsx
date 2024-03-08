import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { debounce } from 'debounce'
import { Editor } from './Editor'
import SplitPane from 'react-split-pane'
import Count from 'word-count'
import useMedia from 'react-use/lib/useMedia'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { useDebouncedState } from '../hooks/useDebouncedState'
import Preview from './Preview'
import Slide from './Slide'
import MarkMap from './MarkMap'
import { ErrorOverlay } from './ErrorOverlay'
import Header from './Header'
import { Button } from '@/components/ui/button'
import { LogoHome } from './Logo'
import { Share } from './Share'
import { CopyBtn } from './Copy'
import ThemeDropdown from './ThemeDropdown'
import { TabBar } from './TabBar'
import { themes } from '../css/markdown-body'
import { compileMdx } from '../hooks/compileMdx'
import { baseCss, codeThemes } from '../css/mdx'
import { confirm } from '@tauri-apps/api/dialog'
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs'
import { listen } from '@tauri-apps/api/event'
import FileTree from './FileTree'
import { t } from '@/utils/i18n'
import { getDefaultContent } from '../utils/getDefaultContent'
import { get } from '../utils/database'
import { sizeToObject } from '../utils/size'
import {
  PenSquare,
  Pencil,
  Columns,
  MonitorSmartphone,
  Square,
} from 'lucide-react'
import clsx from 'clsx'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const DEFAULT_RESPONSIVE_SIZE = { width: 360, height: 720 }

export default function Pen() {
  const router = useRouter()
  const query = router.query
  const [initialContent, setContent] = useState({})
  useEffect(() => {
    const getData = async () => {
      let content
      if (query.id) {
        try {
          content = await get(query.id)
          setContent(content)
          setFilePath('')
          return
        } catch (error) {
          console.log(error)
          content = getDefaultContent()
        }
      }

      content = getDefaultContent()
      if (filePath) {
        content.html = await readTextFile(filePath)
      }
      setContent(content)
    }
    getData()
  }, [query])

  const initialLayout = ['vertical', 'horizontal', 'preview'].includes(
    query.layout
  )
    ? query.layout
    : 'vertical'
  const initialResponsiveSize = sizeToObject(query.size)
  const initialActiveTab = ['html', 'css', 'config'].includes(query.file)
    ? query.file
    : 'html'

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
  const slideRef = useRef()
  const editorRef = useRef()
  const [responsiveDesignMode, setResponsiveDesignMode] = useState(
    initialResponsiveSize ? true : false
  )
  const [isLoading, setIsLoading] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showFileTree, setShowFileTree] = useState(false)
  const [fileTreeSize, setFileTreeSize] = useLocalStorage('file-tree-size', 250)
  const [theme, setTheme] = useLocalStorage('editor-theme', {
    markdownTheme: 'default',
    codeTheme: 'default',
    isMac: true,
    view: 'html',
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
        setTimeout(() => {
          editorRef.current.documents.html.getModel().setValue(res)
          editorRef.current.editor.revealLine(1)
          inject({ scrollTop: true })
        }, 10)
      })
    }
  }
  const handleScroll = (line) => {
    editorRef.current.editor.revealLine(line)
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
    previewRef.current && previewRef.current.setState(content)
  }, [])

  async function compileNow(content) {
    localStorage.setItem('content', JSON.stringify(content))
    if (slideRef.current) {
      slideRef.current.setState(content)
      return
    }
    cancelSetError()
    setIsLoading(true)
    compileMdx(
      content.config,
      content.html,
      theme.isMac,
      'markdown-body',
      theme.formatMarkdown
    ).then((res) => {
      if (res.err) {
        setError(res.err)
      } else {
        setErrorImmediate()
      }
      const { html, toc } = res
      if (html) {
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
      refFileTree.current.setToc(toc)
      setWordCount(Count(content.html || ''))
      setIsLoading(false)
    })
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
    }, 200),
    [theme, filePath]
  )

  useEffect(() => {
    setDirty(false)
    compileNow({
      html: initialContent.html,
      css: initialContent.css,
      config: initialContent.config,
    })
  }, [initialContent])

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

  useEffect(() => {
    if (editorRef.current) {
      compileNow({
        html: editorRef.current.getValue('html'),
        css: editorRef.current.getValue('css'),
        config: editorRef.current.getValue('config'),
      })
    }
  }, [theme])

  const handleShowPPT = useCallback(() => {
    const slideContent = {
      html: editorRef.current.getValue('html'),
      css: editorRef.current.getValue('css'),
      config: editorRef.current.getValue('config'),
    }
    localStorage.setItem('slide', JSON.stringify(slideContent))
    router.push('/slide')
  }, [])

  const createOrOpenDailyNote = async () => {
    refFileTree.current.createOrOpenDailyNote()
  }

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
      className={resizing ? '' : 'file-tree-wrapper'}
      minSize={160}
      maxSize={500}
      size={showFileTree ? fileTreeSize : 0}
      onDragStarted={() => setResizing(true)}
      onDragFinished={() => setResizing(false)}
      onChange={setFileTreeSize}
    >
      <FileTree
        onScroll={handleScroll}
        showFileTree={showFileTree}
        selectedPath={filePath}
        onSelect={readMarkdown}
        ref={refFileTree}
        setShowPPT={handleShowPPT}
      />
      <div className="h-full flex flex-col">
        <Header
          logo={
            <LogoHome
              isActive={showFileTree}
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

              <div className="hidden lg:flex items-center ml-2 rounded-md shadow-sm border dark:bg-gray-800 dark:shadow-highlight/4">
                <Button
                  className="border-0 rounded-none"
                  size="icon"
                  variant="outline"
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
                  variant="outline"
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
                  variant="outline"
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
                  variant="outline"
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
            <Share
              editorRef={editorRef}
              dirty
              initialPath={query.id ? `/${query.id}` : undefined}
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
            <Button onClick={createOrOpenDailyNote} size="sm">
              <Pencil className="w-4 h-4 mr-1" />
              {t('journal')}
            </Button>
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
                        refFileTree.current.setScrollLine(line)
                      }}
                      activeTab={activeTab}
                    />
                  )}
                </div>
                <div className="absolute inset-0 w-full md:h-full top-12 lg:top-0 border-t border-gray-200 dark:border-white/10 lg:border-0 bg-gray-50 dark:bg-slate-950">
                  {theme.view === 'ppt' ? (
                    <Slide ref={slideRef} />
                  ) : theme.view === 'MindMap' ? (
                    <MarkMap ref={slideRef} />
                  ) : (
                    <Preview
                      ref={previewRef}
                      responsiveDesignMode={
                        size.layout !== 'editor' && isLg && responsiveDesignMode
                      }
                      responsiveSize={responsiveSize}
                      onChangeResponsiveSize={setResponsiveSize}
                      iframeClassName={resizing ? 'pointer-events-none' : ''}
                    />
                  )}
                  <ErrorOverlay
                    value={theme}
                    onChange={setTheme}
                    error={error}
                  />
                </div>
              </SplitPane>
            </>
          ) : null}
        </main>
      </div>
    </SplitPane>
  )
}
