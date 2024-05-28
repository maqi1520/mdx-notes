import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { debounce } from 'debounce'
import Editor from './Editor'
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
import ImagePreview from './ImagePreview'
import { Button } from '@/components/ui/button'
import { LogoHome } from './Logo'
import { Share } from './Share'
import { CopyBtn } from './Copy'
import ThemeDropdown from './ThemeDropdown'
import { TabBar } from './TabBar'
import { themes } from '../css/markdown-body'
import { compileMdx, getFrontMatter } from '../hooks/compileMdx'
import { baseCss, codeThemes } from '../css/mdx'
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs'
import { resolve } from '@tauri-apps/api/path'
import FileTree from './FileTree'
import { t } from '@/utils/i18n'
import { sizeToObject } from '../utils/size'
import {
  PenSquare,
  Pencil,
  Columns,
  MonitorSmartphone,
  Square,
} from 'lucide-react'
import clsx from 'clsx'
import {
  supportTextFile,
  isMdFile,
  isImageFile,
  isJsFile,
  isCssFile,
} from './utils/file-tree-util'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const DEFAULT_RESPONSIVE_SIZE = { width: 360, height: 720 }

export default function Pen({
  dirPath,
  setDirPath,
  filePath,
  setFilePath,
  defaultValue,
}) {
  const router = useRouter()
  const query = router.query

  const initialLayout = ['vertical', 'horizontal', 'preview'].includes(
    query.layout
  )
    ? query.layout
    : 'vertical'
  const initialResponsiveSize = sizeToObject(query.size)

  const resultRef = useRef()
  const previewRef = useRef()
  const [size, setSize] = useState({ percentage: 0.5, layout: initialLayout })
  const [resizing, setResizing] = useState(false)

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
  const [showFileTree, setShowFileTree] = useLocalStorage('showFileTree', false)
  const [fileTreeSize, setFileTreeSize] = useLocalStorage('file-tree-size', 250)
  const [theme, setTheme] = useLocalStorage('editor-theme', {
    markdownTheme: 'default',
    codeTheme: 'default',
    isMac: true,
    view: 'html',
    raw: false,
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

  const refFileTree = useRef()

  useEffect(() => {
    window.webViewFocus = async () => {
      if (filePath && supportTextFile(filePath) && editorRef.current) {
        const res = await readTextFile(filePath)
        if (res !== editorRef.current.getModel().getValue()) {
          setTimeout(() => {
            editorRef.current.getModel().setValue(res)
          }, 10)
        }
      }
    }
    if (isMdFile(filePath)) {
      inject({ scrollTop: true })
    }
    return () => {
      window.webViewFocus = () => {}
    }
  }, [filePath])

  const handleScroll = (line) => {
    editorRef.current.revealLine(line)
  }

  const inject = useCallback(async (content) => {
    previewRef.current && previewRef.current.setState(content)
  }, [])

  async function compileNow(content) {
    console.log('compile', filePath)
    let md = resultRef.current?.md || ''
    if (isMdFile(filePath)) {
      md = content
    }
    console.log('md', md)

    cancelSetError()
    setIsLoading(true)
    const frontMatter = getFrontMatter(md)
    const fileThemeName = frontMatter.theme
    let codeTheme = codeThemes[theme.codeTheme].css
    let markdownTheme = themes[theme.markdownTheme].css
    let jsx = ''
    if (fileThemeName) {
      try {
        if (isCssFile(filePath) && filePath.includes(`${fileThemeName}.css`)) {
          markdownTheme = content
        } else {
          const cssPath = await resolve(
            dirPath,
            `plugins/themes/${fileThemeName}.css`
          )
          markdownTheme = await readTextFile(cssPath)
        }
      } catch (error) {
        console.log(error)
      }
      try {
        if (isJsFile(filePath) && filePath.includes(`${fileThemeName}.js`)) {
          jsx = content
        } else {
          const jsPath = await resolve(
            dirPath,
            `plugins/themes/${fileThemeName}.js`
          )
          jsx = await readTextFile(jsPath)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (slideRef.current) {
      slideRef.current.setState({
        config: jsx,
        html: md,
        css: markdownTheme,
      })
      return
    }

    console.log('jsx', jsx)
    console.log('css', markdownTheme)

    compileMdx(
      jsx,
      md,
      theme.isMac,
      'markdown-body',
      theme.formatMarkdown,
      theme.raw
    ).then((res) => {
      if (res.err) {
        setError(res.err)
      } else {
        setErrorImmediate()
      }
      const { html, toc } = res
      if (html) {
        if (html) {
          const result = {
            md,
            markdownTheme,
            jsx,
            frontMatter,
            css: baseCss + markdownTheme + codeTheme,
            html,
            codeTheme: theme.codeTheme,
          }
          //编译后的结果保存到ref 中
          resultRef.current = result
          inject(result)
        }
      }

      refFileTree.current.setToc(toc)
      setWordCount(Count(md || ''))
      setIsLoading(false)
    })
  }

  // 切换文件的时候渲染
  useEffect(() => {
    compileNow(defaultValue)
  }, [defaultValue])

  const onChange = useCallback(
    debounce((value) => {
      compileNow(value)
      if (filePath) {
        console.log('write', filePath)
        writeTextFile(filePath, value)
          .then(() => {
            setDirty(false)
          })
          .catch((err) => {
            console.log(err)
            setDirty(true)
          })
      } else {
        setDirty(true)
      }
    }, 500),
    [filePath]
  )

  const onScroll = useCallback(
    (line) => {
      if (isMdFile(filePath)) {
        inject({ line })
        refFileTree.current.setScrollLine(line)
      }
    },
    [filePath]
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

        const newSize = isLg && size.layout !== 'preview' ? windowSize : 0

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
  }, [isLg, size.layout, showFileTree, fileTreeSize])

  useEffect(() => {
    if (isLg) {
      if (size.layout !== 'preview') {
        setRenderEditor(true)
      }
    }
  }, [isLg, size.layout])

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
      compileNow(editorRef.current.getModel().getValue())
    }
  }, [theme])

  const handleShowPPT = useCallback(async () => {
    const md = editorRef.current.getModel().getValue()
    const frontMatter = getFrontMatter(md)
    const fileThemeName = frontMatter.theme
    let markdownTheme = ''
    let jsx = ''
    if (fileThemeName) {
      try {
        const cssPath = await resolve(
          dirPath,
          `plugins/themes/${fileThemeName}.css`
        )
        markdownTheme = await readTextFile(cssPath)
        const jsPath = await resolve(
          dirPath,
          `plugins/themes/${fileThemeName}.js`
        )
        jsx = await readTextFile(jsPath)
      } catch (error) {
        console.log(error)
      }
    }
    const slideContent = {
      html: md,
      css: markdownTheme,
      config: jsx,
    }
    localStorage.setItem('slide', JSON.stringify(slideContent))
    router.push('/slide')
  }, [])

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
        dirPath={dirPath}
        setDirPath={setDirPath}
        onScroll={handleScroll}
        showFileTree={showFileTree}
        selectedPath={filePath}
        onSelect={setFilePath}
        ref={refFileTree}
        setShowPPT={handleShowPPT}
      />
      {isImageFile(filePath) ? (
        <ImagePreview path={filePath} />
      ) : (
        <div className="h-full flex flex-col">
          <Header
            logo={
              <LogoHome
                isActive={showFileTree}
                onClick={() => setShowFileTree(!showFileTree)}
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
                    onClick={() =>
                      setResponsiveDesignMode(!responsiveDesignMode)
                    }
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
                resultRef={resultRef}
                layout={size.layout}
                responsiveSize={
                  responsiveDesignMode ? responsiveSize : undefined
                }
              />
              <CopyBtn resultRef={resultRef} previewRef={previewRef} />
              <Button
                onClick={() => refFileTree.current.createOrOpenDailyNote()}
                size="sm"
              >
                <Pencil className="w-4 h-4 mr-1" />
                {t('journal')}
              </Button>
            </div>
          </Header>
          <main className="flex-auto relative border-t border-gray-200 dark:border-gray-800">
            {typeof size.current !== 'undefined' ? (
              <>
                {(!isLg || size.layout !== 'preview') && (
                  <TabBar
                    width={
                      size.layout === 'vertical' && isLg ? size.current : '100%'
                    }
                    isLoading={isLoading}
                    dirty={dirty}
                    resultRef={resultRef}
                    wordCount={wordCount}
                  />
                )}
                <SplitPane
                  split={
                    size.layout === 'horizontal' ? 'horizontal' : 'vertical'
                  }
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
                  <div className="border-t border-gray-200 dark:border-white/10 flex-auto flex">
                    {renderEditor && (
                      <Editor
                        onMount={(ref) => (editorRef.current = ref)}
                        defaultValue={defaultValue}
                        onChange={onChange}
                        onScroll={onScroll}
                        path={filePath}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 w-full md:h-full top-0 border-t border-gray-200 dark:border-white/10 lg:border-0 bg-gray-50 dark:bg-slate-950">
                    {theme.view === 'ppt' ? (
                      <Slide ref={slideRef} />
                    ) : theme.view === 'MindMap' ? (
                      <MarkMap ref={slideRef} />
                    ) : (
                      <Preview
                        ref={previewRef}
                        responsiveDesignMode={
                          size.layout !== 'editor' &&
                          isLg &&
                          responsiveDesignMode
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
      )}
    </SplitPane>
  )
}
