import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
  memo,
} from 'react'
import {
  isMdFile,
  supportFile,
  sortFile,
  renamePath,
  getCurrentFolderName,
  findPathInTree,
} from './utils/file-tree-util'

import { searchResponse } from './utils/search'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { confirm, message, open } from '@tauri-apps/api/dialog'
import { documentDir, resolve } from '@tauri-apps/api/path'
import { appWindow } from '@tauri-apps/api/window'
import { type } from '@tauri-apps/api/os'
import {
  exists,
  readDir,
  createDir,
  removeFile,
  renameFile,
  writeTextFile,
  readTextFile,
  removeDir,
} from '@tauri-apps/api/fs'
import { t } from '@/utils/i18n'
import { tauri } from '@tauri-apps/api'
import { open as openLink } from '@tauri-apps/api/shell'
import { store } from '../monaco/data'
import Tree from './Tree'
import SearchList from './SearchList'
import TocList from './TocList'
import clsx from 'clsx'
import {
  FolderRoot,
  SearchIcon,
  FolderPlusIcon,
  ListTreeIcon,
  ListIcon,
  XCircleIcon,
} from 'lucide-react'
import dayjs from 'dayjs'

async function show_in_folder(path) {
  await tauri.invoke('show_in_folder', { path })
}

const FileTree = forwardRef(
  (
    {
      onSelect,
      selectedPath,
      showFileTree,
      setShowPPT,
      onScroll,
      dirPath,
      setDirPath,
    },
    ref
  ) => {
    const [isMac, setIsMac] = useState(false)
    useLayoutEffect(() => {
      async function init() {
        const osType = await type()
        setIsMac(osType === 'Darwin')
      }
      init()
    }, [])
    const [scrollLine, setScrollLine] = useState(1)
    const [toc, setToc] = useState([])
    const [showToc, setShowToc] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const searchInputRef = useRef()
    const refInput = useRef([])
    const [searchList, setSearchList] = useState([])
    const [expandedKeys, setExpandedKeys] = useLocalStorage('expandedKeys', [])
    const [fileTreeData, setTreeData] = useState([])

    const reloadTree = async () => {
      const res = await exists(dirPath)
      if (res) {
        const entries = await readDir(dirPath, { recursive: true })
        if (entries) {
          store.mdFiles = []
          const generateList = (data) => {
            for (let i = 0; i < data.length; i++) {
              const node = data[i]
              if (isMdFile(node.name)) {
                store.mdFiles.push({
                  name: node.name.split('.md')[0],
                  path: node.path,
                })
              }
              if (node.children) {
                generateList(node.children)
              }
            }
          }

          generateList(entries)

          setTreeData(entries)
        }
      }
    }
    useEffect(() => {
      reloadTree()
    }, [dirPath])
    const [action, setAction] = useState({
      path: '',
      type: '',
    })

    const openMd = async (file, content) => {
      if (!content) {
        content = `---
title: ${file}
---

# ${file}

`
      }
      const path = findPathInTree(file.trim(), store.mdFiles)
      if (path) {
        onSelect(path)
        setSelectedKeys([path])
        return
      }
      const filePath = await resolve(dirPath, file.trim() + '.md')
      if (!(await exists(filePath))) {
        if (file.includes('/')) {
          const [dirName] = file.split('/')
          const path = await resolve(dirPath, dirName)
          if (!(await exists(path))) {
            await createDir(path)
          }
        }
        await writeTextFile(filePath, content)
        reloadTree()
      }
      onSelect(filePath)
      setSelectedKeys([filePath])
    }
    const createOrOpenDailyNote = async () => {
      const fileName = dayjs().format('YYYY-MM-DD')
      const config = JSON.parse(localStorage.getItem('config'))
      const dirPath = JSON.parse(localStorage.getItem('dir-path'))

      const fullPath = config.journalDir
        ? config.journalDir + '/' + fileName
        : fileName
      if (config.journalTemplateDir) {
        const filePath = await resolve(
          dirPath,
          config.journalTemplateDir.trim()
        )

        try {
          const content = await readTextFile(filePath)
          openMd(fullPath, content.replace(/{{date}}/g, fileName))
        } catch (error) {
          message(t('The template file does not exist'), {
            title: t('Prompt'),
            type: 'error',
          })
        }
      } else {
        openMd(fullPath)
      }
    }

    useEffect(() => {
      const handleMessage = async (e) => {
        if (e.data.event === 'open') {
          const href = e.data.href
          if (/^https?:\/\//.test(href)) {
            await openLink(href)
          } else {
            openMd(decodeURIComponent(href), '')
          }
        }
      }
      window.addEventListener('message', handleMessage, false)
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }, [fileTreeData])

    useEffect(() => {
      // 新建快捷键
      window.newFile = async () => {
        if (dirPath) {
          const fileName = 'Untitled_' + new Date().valueOf() + '.md'
          await writeTextFile(dirPath + '/' + fileName, '')
          setSelectedKeys([dirPath + '/' + fileName])
          reloadTree()
          onSelect(dirPath + '/' + fileName)
        } else {
          message(t('Please set the working directory'), {
            title: t('Prompt'),
            type: 'error',
          })
        }
      }
    }, [dirPath])

    const fileExists = async () => {
      await message(t('File already exists'), {
        title: t('Prompt'),
        type: 'error',
      })
      setAction({
        path: '',
        type: '',
      })
    }

    useImperativeHandle(
      ref,
      () => ({
        setExpandedKeys,
        setToc,
        setScrollLine,
        openMd,
        createOrOpenDailyNote,
        reload: reloadTree,
      }),
      []
    )

    const onChange = async (e) => {
      const { value } = e.target
      if (value.trim() === '') {
        setSearchList([])
        setSearchValue(value)
        return
      }
      if (e.keyCode !== 13) {
        return
      }
      const result = await searchResponse({
        keywords: value.trim(),
        mdFiles: store.mdFiles,
      })
      setSearchList(result)
      setSearchValue(value)
    }
    const onBlur = async (e) => {
      let name = e.target.value.trim()
      if (name === '') {
        setAction({
          path: '',
          type: '',
        })
        return
      }

      const { type, path } = action

      const actionObj = {
        rename: async () => {
          const isDir = e.target.dataset.dir === 'true'
          if (!isDir && !isMdFile(name)) {
            name = name + '.md'
          }
          const newPath = renamePath(path, name)
          //  重命名文件名不变
          if (path === newPath) {
            setAction({
              path: '',
              type: '',
            })
            return
          }
          if (await exists(newPath)) {
            await fileExists()
            return
          }
          await renameFile(path, newPath)
          reloadTree()
          setAction({
            path: '',
            type: '',
          })
          onSelect(newPath)
        },
        createDir: async () => {
          const newPath = path + '/' + name
          if (await exists(newPath)) {
            await fileExists()
            return
          }
          await createDir(newPath, { recursive: true })
          reloadTree()
          setAction({
            path: '',
            type: '',
          })
        },
        createFile: async () => {
          if (!/\.(md|css|js)/.test(name)) {
            name = name + '.md'
          }
          const newPath = path + '/' + name

          if (await exists(newPath)) {
            await fileExists()
            return
          }
          await writeTextFile(newPath, '')
          onSelect(newPath)
          reloadTree()
          setAction({
            path: '',
            type: '',
          })
        },
      }
      //执行动作
      actionObj[type]()
    }

    const treeData = useMemo(() => {
      const renterInput = (item, title) => (
        <input
          ref={refInput}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.keyCode === 13 || e.code === 'Escape') {
              onBlur(e)
            }
          }}
          data-dir={!item.isLeaf}
          onClick={(e) => e.stopPropagation()}
          className="h-[30px] mt-0 border-2 border-sky-500 w-[160px] bg-white text-black px-1 outline-none"
          defaultValue={title}
        />
      )
      const loop = (data, parent) => {
        const result = sortFile(data)
          .map((item) => {
            if (item.name.startsWith('.')) {
              return false
            }
            const strTitle = !/^Untitled_\d{13}\.md$/.test(item.name)
              ? item.name
              : t('Untitled.md')
            let title = <span className="select-none">{strTitle}</span>
            if (action.type === 'rename' && item.path === action.path) {
              title = renterInput(item, strTitle)
            }
            if (item.children) {
              return {
                title,
                key: item.path,
                children: loop(item.children, item),
              }
            }
            if (item.path && supportFile(item.path)) {
              return {
                isLeaf: true,
                title,
                key: item.path,
              }
            }
            return false
          })
          .filter(Boolean)
        if (
          (action.type === 'createDir' || action.type === 'createFile') &&
          parent.path === action.path
        ) {
          return [
            {
              isLeaf: action.type === 'createFile',
              title: renterInput({ path: parent.path }, ''),
              key: parent.path,
            },
            ...result,
          ]
        }
        return result
      }

      return loop(fileTreeData, { key: dirPath, title: 'root', path: dirPath })
    }, [searchValue, selectedPath, fileTreeData, action])

    const menuRef = useRef()
    const [selectedKeys, setSelectedKeys] = useState([selectedPath])
    const [menuStyle, setMenuStyle] = useState({ display: 'none' })

    useEffect(() => {
      const handleClick = (e) => {
        const element = menuRef.current
        if (element && e.target !== element && !element.contains(e.target)) {
          setMenuStyle({
            display: 'none',
          })
        }
      }
      document.addEventListener('click', handleClick)
      return () => {
        document.removeEventListener('click', handleClick)
      }
    }, [])

    const onRightClick = (event, key) => {
      event.stopPropagation()
      event.preventDefault()
      setMenuStyle({
        display: 'block',
        top: event.clientY,
        left: event.clientX,
      })
      setSelectedKeys([key])
    }
    const handleCreateDir = () => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      if (!expandedKeys.includes(path)) {
        setExpandedKeys([...expandedKeys, path])
      }
      setAction({
        path,
        type: 'createDir',
      })
      setTimeout(() => {
        if (refInput.current) {
          refInput.current.setSelectionRange(0, 8)
        }
      }, 300)
    }
    const handleCreate = () => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      if (!expandedKeys.includes(path)) {
        setExpandedKeys([...expandedKeys, path])
      }
      setAction({
        path,
        type: 'createFile',
      })
      setTimeout(() => {
        if (refInput.current) {
          refInput.current.setSelectionRange(0, 8)
        }
      }, 300)
    }

    const handleRename = useCallback(() => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      if (!path || path === dirPath) {
        return
      }
      setAction({
        path,
        type: 'rename',
      })
      setTimeout(() => {
        if (refInput.current) {
          const value = refInput.current.value
          refInput.current.setSelectionRange(0, value.split('.md')[0].length)
        }
      }, 300)
    }, [selectedKeys, dirPath])

    const handleOpenFinder = async () => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      await show_in_folder(path)
    }

    const handleRefresh = async () => {
      setMenuStyle({ display: 'none' })
      reloadTree()
    }
    const handleDelete = useCallback(async () => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      if (!path || path === dirPath) {
        return
      }
      const name = getCurrentFolderName(path)
      const confirmed = await confirm(
        `${t('Are you sure you want to delete')}'${name}'?`,
        {
          title: t('Delete confirmation'),
          type: 'warning',
        }
      )
      if (confirmed) {
        if (isMdFile(path)) {
          await removeFile(path)
        } else {
          removeDir(path, {
            recursive: true,
          })
        }
        reloadTree()
      }
    }, [selectedKeys, dirPath])

    const handlePPT = async () => {
      setMenuStyle({ display: 'none' })
      setShowPPT()
      await appWindow.setFullscreen(true)
    }

    let menu = [
      { name: t('Rename'), event: handleRename },
      { name: t('Delete'), event: handleDelete },
      { name: t('PPT View'), event: handlePPT },
      { name: t('Reveal in Finder'), event: handleOpenFinder },
    ]
    const dirItemMenu = [
      { name: t('New File'), event: handleCreate },
      { name: t('New Folder'), event: handleCreateDir },
      { name: t('Refresh'), event: handleRefresh },
    ]
    if (!isMdFile(selectedKeys[0])) {
      menu = [...dirItemMenu, ...menu]
    }
    if (selectedKeys[0] === dirPath) {
      menu = dirItemMenu
    }
    const handleChooseDir = async () => {
      const selected = await open({
        directory: true,
        defaultPath: await documentDir(),
      })
      if (selected) {
        setDirPath(selected)
        setExpandedKeys([])
      }
    }
    if (!showFileTree) {
      return <div />
    }

    return (
      <div className="w-full overflow-auto h-screen flex flex-col">
        <div
          data-tauri-drag-region
          className={clsx(
            'px-4 pb-3 bg-white dark:bg-gray-900 sticky top-0 left-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center flex-none',
            isMac ? 'pt-7' : 'pt-4'
          )}
        >
          <div className="flex items-center w-full text-left px-2 h-8 mt-[2px] bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700">
            <SearchIcon className="w-4 h-4 flex-none text-slate-300 dark:text-slate-400" />
            <input
              className="flex-auto bg-transparent w-full px-2 focus:ring-0 outline-none h-full border-0 text-slate-900 dark:text-slate-200"
              aria-label="search"
              ref={searchInputRef}
              onKeyDown={onChange}
            />
            {searchValue && (
              <XCircleIcon
                onClick={() => {
                  setSearchValue('')
                  searchInputRef.current.value = ''
                }}
                className="w-4 h-4 cursor-pointer flex-none text-slate-300 dark:text-slate-400"
              />
            )}
          </div>
          {!searchValue && (
            <span
              onClick={() => setShowToc(!showToc)}
              className="pl-2 cursor-pointer text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
            >
              {showToc ? <ListIcon /> : <ListTreeIcon />}
            </span>
          )}
        </div>
        <SearchList
          value={searchList}
          onSelect={onSelect}
          searchValue={searchValue}
        >
          <TocList
            scrollLine={scrollLine}
            onScroll={onScroll}
            toc={toc}
            showToc={showToc}
          >
            <div
              ref={menuRef}
              style={menuStyle}
              className="fixed rounded-md bg-[#E6DFE7] shadow-sm border p-1 text-[12px] font-sans z-50 w-36"
            >
              {menu.map((item) => (
                <div
                  key={item.name}
                  onClick={item.event}
                  className="py-[2px] px-2 cursor-pointer text-black hover:text-white hover:bg-blue-500 rounded flex justify-between"
                >
                  <span>{item.name}</span>
                  <span className="opacity-50">{item.extra}</span>
                </div>
              ))}
            </div>
            <div
              onContextMenu={(e) => onRightClick(e, dirPath)}
              className="pr-3 pl-1 overflow-x-hidden pb-12 pt-3 flex-auto"
            >
              {dirPath && (
                <div className="text-sm font-semibold flex items-center ml-3 mb-2 select-none text-slate-900 dark:text-slate-200">
                  <FolderRoot className="w-4 h-4 mr-1 flex-none" />
                  <span className="flex-auto">
                    {getCurrentFolderName(dirPath)}
                  </span>
                </div>
              )}
              <Tree
                onRightClick={onRightClick}
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
                onSelect={(key) => {
                  onSelect(key)
                }}
                selectedPath={selectedPath}
                treeData={treeData}
              />
            </div>
            <div className="w-full flex absolute bottom-0 left-0 z-10 justify-center items-center text-sm">
              <button
                className="text-gray-500 text-xs leading-5 font-semibold bg-gray-100  py-2 hover:bg-gray-400/20 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:shadow-highlight/4 w-full border-t border-gray-200 dark:border-gray-800 flex  justify-center items-center"
                onClick={handleChooseDir}
              >
                <FolderPlusIcon className="w-4 h-4" />
                <span className="ml-1">{t('Open Folder')}</span>
              </button>
            </div>
          </TocList>
        </SearchList>
      </div>
    )
  }
)

export default memo(FileTree)
