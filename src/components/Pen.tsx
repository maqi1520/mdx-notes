import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { debounce } from 'debounce'
import Count from 'word-count'
import useMedia from 'react-use/lib/useMedia'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { useDebouncedState } from '../hooks/useDebouncedState'
import Preview, { PreviewRef } from './Preview'
import Slide, { SlideRef } from './Slide'
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
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { getCurrent } from '@tauri-apps/api/window'
import { resolve } from '@tauri-apps/api/path'
import FileTree, { TreeRef } from './FileTree'
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
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import MoreDropDown from './MoreDropdown'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
})

const defaultTheme = {
  formatMarkdown: false,
  markdownTheme: 'default',
  codeTheme: 'default',
  isMac: true,
  view: 'html',
  raw: false,
}

const DEFAULT_RESPONSIVE_SIZE = { width: 360, height: 720 }

interface Props {
  dirPath: string
  setDirPath: (path: string) => void
  setFilePath: (path: string) => void
  filePath: string
}

export default function Pen({
  dirPath,
  setDirPath,
  filePath,
  setFilePath,
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const resultRef = useRef<{
    md: string
    markdownTheme: string
    jsx: string
    frontMatter: {}
    css: string
    html: string
    codeTheme: string
  }>()
  const previewRef = useRef<PreviewRef>(null)

  const [layout = 'vertical', setLayout] = useLocalStorage('layout', 'vertical')
  const [resizing, setResizing] = useState(false)

  const isLg = useMedia('(min-width: 1024px)')
  const [dirty, setDirty] = useState(false) //是否修改过
  const [error, setError, setErrorImmediate, cancelSetError] =
    useDebouncedState(undefined, 1000)
  const slideRef = useRef<SlideRef>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const [responsiveDesignMode = false, setResponsiveDesignMode] =
    useLocalStorage('responsiveDesignMode', false)
  const [fileText, setFileText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showFileTree = false, setShowFileTree] = useLocalStorage(
    'showFileTree',
    false
  )

  const [theme = defaultTheme, setTheme] = useLocalStorage(
    'editor-theme',
    defaultTheme
  )
  const [responsiveSize, setResponsiveSize] = useState(DEFAULT_RESPONSIVE_SIZE)

  const refFileTree = useRef<TreeRef>(null)

  useEffect(() => {
    // 窗口获取焦点，重新读取文件
    const appWindow = getCurrent()
    const unListen = appWindow.listen('tauri://focus', async () => {
      console.log('Window has gained focus!')
      if (filePath && supportTextFile(filePath) && editorRef.current) {
        const res = await readTextFile(filePath)
        setFileText(res)
      }
    })

    return () => {
      unListen.then((f) => f())
    }
  }, [filePath])

  useEffect(() => {
    if (supportTextFile(filePath)) {
      readTextFile(filePath).then((res) => {
        setFileText(res)
        if (isMdFile(filePath)) {
          compileNow(res)
          inject({ scrollTop: true })
        }
      })
    }
  }, [layout, filePath, theme])

  const handleScroll = (line) => {
    editorRef.current?.revealLine(line)
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

      refFileTree.current?.setToc(toc as string[])
      setWordCount(Count(md || ''))
      setIsLoading(false)
    })
  }

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
    [filePath, theme]
  )

  const onScroll = useCallback(
    (line) => {
      if (isMdFile(filePath)) {
        inject({ line })
        refFileTree.current?.setScrollLine(line)
      }
    },
    [filePath]
  )

  useEffect(() => {
    if (resizing) {
      document.body.classList.add(
        layout === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    } else {
      document.body.classList.remove(
        layout === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    }
  }, [resizing])

  const handleShowPPT = useCallback(async () => {
    const md = editorRef.current?.getModel()?.getValue()
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
    <ResizablePanelGroup autoSaveId="file-tree-size" direction="horizontal">
      {showFileTree && (
        <>
          <ResizablePanel order={1} minSize={15} maxSize={40} defaultSize={20}>
            <FileTree
              dirPath={dirPath}
              setDirPath={setDirPath}
              onScroll={handleScroll}
              selectedPath={filePath}
              onSelect={setFilePath}
              ref={refFileTree}
              setShowPPT={handleShowPPT}
            />
          </ResizablePanel>
          <ResizableHandle onDragging={(r) => setResizing(r)} />
        </>
      )}

      <ResizablePanel order={2} className="h-screen">
        {isImageFile(filePath) ? (
          <ImagePreview path={filePath} />
        ) : (
          <div className="h-full flex flex-col">
            <Header
              logo={
                <>
                  <LogoHome
                    isActive={showFileTree}
                    onClick={() => setShowFileTree(!showFileTree)}
                  />
                  <div className="hidden sm:flex space-x-2">
                    <Share
                      resultRef={resultRef}
                      layout={layout}
                      responsiveSize={
                        responsiveDesignMode ? responsiveSize : undefined
                      }
                    />
                    <CopyBtn resultRef={resultRef} />
                    <Button
                      onClick={refFileTree.current?.createOrOpenDailyNote}
                      size="sm"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      {t('journal')}
                    </Button>
                  </div>
                </>
              }
            >
              <ThemeDropdown
                value={theme}
                onChange={setTheme}
                themes={themes}
                codeThemes={codeThemes}
              />
              <MoreDropDown resultRef={resultRef} />

              <div className="hidden lg:flex items-center ml-2 rounded-md shadow-sm border dark:bg-gray-800 dark:shadow-highlight/4">
                <Button
                  className="border-0 rounded-none"
                  size="icon"
                  variant="outline"
                  onClick={() => setLayout('vertical')}
                >
                  <Columns
                    className={clsx('w-5 h-5', {
                      'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                        layout === 'vertical',
                    })}
                  />
                </Button>
                <Button
                  className="border-0 rounded-none"
                  size="icon"
                  variant="outline"
                  onClick={() => setLayout('editor')}
                >
                  <PenSquare
                    className={clsx('w-5 h-5', {
                      'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                        layout === 'editor',
                    })}
                  />
                </Button>
                <Button
                  className="border-0 rounded-none"
                  size="icon"
                  variant="outline"
                  onClick={() => setLayout('preview')}
                >
                  <Square
                    className={clsx('w-5 h-5', {
                      'stroke-primary fill-sky-100 dark:fill-sky-400/50':
                        layout === 'preview',
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
            </Header>
            <main className="flex-auto relative border-t border-gray-200 dark:border-gray-800">
              <ResizablePanelGroup direction={'horizontal'}>
                {(layout === 'editor' || layout === 'vertical') && (
                  <ResizablePanel order={1}>
                    <div className="relative h-full border-t border-gray-200 dark:border-white/10 flex-auto flex">
                      <TabBar
                        width="100%"
                        isLoading={isLoading}
                        dirty={dirty}
                        resultRef={resultRef}
                        wordCount={wordCount}
                      />
                      <Editor
                        onMount={(ref) => (editorRef.current = ref)}
                        value={fileText}
                        onChange={onChange}
                        onScroll={onScroll}
                        path={filePath}
                      />
                    </div>
                  </ResizablePanel>
                )}
                {layout === 'vertical' && (
                  <ResizableHandle onDragging={(r) => setResizing(r)} />
                )}

                {(layout === 'preview' || layout === 'vertical') && (
                  <ResizablePanel order={2}>
                    <div className="relative h-full border-t border-gray-200 dark:border-white/10 lg:border-0 bg-gray-50 dark:bg-slate-950">
                      {theme.view === 'ppt' ? (
                        <Slide ref={slideRef} />
                      ) : theme.view === 'MindMap' ? (
                        <MarkMap ref={slideRef} />
                      ) : (
                        <Preview
                          ref={previewRef}
                          responsiveDesignMode={isLg && responsiveDesignMode}
                          responsiveSize={responsiveSize}
                          onChangeResponsiveSize={setResponsiveSize}
                          iframeClassName={
                            resizing ? 'pointer-events-none' : ''
                          }
                        />
                      )}
                      <ErrorOverlay
                        value={theme}
                        onChange={setTheme}
                        error={error}
                      />
                    </div>
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </main>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
