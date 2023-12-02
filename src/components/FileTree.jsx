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
import FolderPlusIcon from './icons/FolderPlusIcon'
import HomeIcon from './icons/HomeIcon'
import SearchIcon from './icons/SearchIcon'
import {
  isMdFile,
  mapTree,
  findPathTree,
  findPathInTree,
  sortFile,
  renamePath,
  getCurrentFolderName,
} from './utils/file-tree-util'

import { searchResponse } from './utils/search'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { confirm, message, open } from '@tauri-apps/api/dialog'
import { documentDir, resolve } from '@tauri-apps/api/path'
import { appWindow } from '@tauri-apps/api/window'
import { type } from '@tauri-apps/api/os'
import {
  exists,
  createDir,
  readDir,
  removeFile,
  renameFile,
  writeTextFile,
  removeDir,
  BaseDirectory,
} from '@tauri-apps/api/fs'
import { t } from '@/utils/i18n'
import { tauri } from '@tauri-apps/api'
import initial from '@/utils/initial/'
import { open as openLink } from '@tauri-apps/api/shell'
import { store } from '../monaco/data'
import Tree from './Tree'
import SearchList from './SearchList'
import clsx from 'clsx'

async function show_in_folder(path) {
  await tauri.invoke('show_in_folder', { path })
}

const FileTree = forwardRef(
  ({ onSelect, selectedPath, showFileTree, setShowPPT }, ref) => {
    const [isMac, setIsMac] = useState(false)
    useLayoutEffect(() => {
      async function init() {
        const osType = await type()
        setIsMac(osType === 'Darwin')
      }
      init()
    }, [])
    const [count, setCount] = useState(0)
    const [searchValue, setSearchValue] = useState('')

    const refInput = useRef([])
    const [searchList, setSearchList] = useState([])
    const [data, setData] = useState([])
    const [expandedKeys, setExpandedKeys] = useLocalStorage('expandedKeys', [])
    const [dirPath, setDirPath] = useLocalStorage('dir-path', '')

    useEffect(() => {
      const handleMessage = async (e) => {
        if (e.data.event === 'open') {
          const href = e.data.href
          if (/^https?:\/\//.test(href)) {
            await openLink(href)
          } else {
            const path = findPathInTree(decodeURIComponent(href), store.mdFiles)
            if (path) {
              onSelect(path)
              setSelectedKeys([path])
            }
          }
        }
      }
      window.addEventListener('message', handleMessage, false)
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }, [data])

    useEffect(() => {
      // 新建快捷键
      window.newFile = async () => {
        if (dirPath) {
          const fileName = 'Untitled_' + new Date().valueOf() + '.md'
          await writeTextFile(dirPath + '/' + fileName, '')
          setSelectedKeys([dirPath + '/' + fileName])
          setCount((p) => p + 1)
          onSelect(dirPath + '/' + fileName)
        } else {
          message(t('Please set the working directory'), {
            title: t('Prompt'),
            type: 'error',
          })
        }
      }
    }, [dirPath])

    useEffect(() => {
      exists(dirPath).then(async (res) => {
        if (!res) {
          const documentDirPath = await documentDir()
          const path = await resolve(documentDirPath, 'mdx-editor')

          if (!(await exists(path))) {
            await createDir('mdx-editor', {
              dir: BaseDirectory.Document,
              recursive: true,
            })

            for (const key in initial) {
              const content = initial[key]
              await writeTextFile(path + `/${key}.md`, content)
            }

            setDirPath(path)
          }
        }
      })
    }, [])

    useEffect(() => {
      exists(dirPath).then(async (res) => {
        if (res) {
          readDir(dirPath, { recursive: true }).then((entries) => {
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

              setData(entries)
            }
          })
        }
      })
    }, [dirPath, count])

    useImperativeHandle(
      ref,
      () => ({
        setDirPath: (path) => {
          setDirPath(path)
          setExpandedKeys([])
        },
        reload: () => setCount((p) => p + 1),
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
        setCount(count + 1)
        return
      }

      const path = e.target.dataset.path
      const type = e.target.dataset.type
      const isDir = e.target.dataset.dir === 'true'
      if (!isDir && !isMdFile(name)) {
        name = name + '.md'
      }
      const newPath = renamePath(path, name)
      //  重命名文件名不变
      if (type === 'rename' && path === newPath) {
        setCount(count + 1)
        return
      }

      if (findPathTree(newPath, data)) {
        await message(t('File already exists'), {
          title: t('Prompt'),
          type: 'error',
        })
        setCount(count + 1)
        return
      }
      if (type === 'rename') {
        await renameFile(path, newPath)
        const newSelectedKeys = selectedKeys.filter((k) => k !== path)
        newSelectedKeys.push(newPath)
        setSelectedKeys(newSelectedKeys)
        if (selectedPath === path) {
          onSelect(newPath)
        }
      } else {
        if (isDir) {
          await createDir(newPath, { recursive: true })
        } else {
          await writeTextFile(newPath, '')
        }
      }
      setCount(count + 1)
    }

    const treeData = useMemo(() => {
      const loop = (data) => {
        return sortFile(data)
          .map((item) => {
            const strTitle = !/^Untitled_\d{13}\.md$/.test(item.name)
              ? item.name
              : t('Untitled.md')

            let title = <span className="select-none">{strTitle}</span>

            if (item.input) {
              title = (
                <input
                  ref={refInput}
                  onBlur={onBlur}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 || e.code === 'Escape') {
                      onBlur(e)
                    }
                  }}
                  data-name={item.name}
                  data-type={item.input}
                  data-path={item.path}
                  data-dir={!!item.children}
                  onClick={(e) => e.stopPropagation()}
                  className="h-[30px] mt-0 border-2 border-sky-500 w-[160px] bg-white text-black px-1 outline-none"
                  defaultValue={strTitle}
                />
              )
            }
            if (item.children) {
              return {
                title,
                key: item.path,
                children: loop(item.children),
              }
            }
            if (isMdFile(item.path)) {
              return {
                isLeaf: true,
                title,
                key: item.path,
              }
            }
            return false
          })
          .filter(Boolean)
      }

      return loop(data)
    }, [searchValue, selectedPath, data])

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
      const newData = mapTree(path, data, (node) => {
        return {
          ...node,
          children: [
            { name: '', path: `${path}/.md`, input: true, children: [] },
            ...node.children,
          ],
        }
      })

      setData(newData)
      setExpandedKeys((prev) => [...prev, `${path}/.md`])
      setTimeout(() => {
        if (refInput.current) {
          refInput.current.setSelectionRange(0, 8)
        }
      }, 300)
    }
    const handleCreate = () => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      const newData = mapTree(path, data, (node) => {
        return {
          ...node,
          children: [
            { name: '', path: `${path}/.md`, input: true },
            ...node.children,
          ],
        }
      })
      setExpandedKeys((prev) => [...prev, `${path}`])
      setData(newData)
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
      const newData = mapTree(path, data, (item) => {
        return {
          ...item,
          input: 'rename',
        }
      })
      setData(newData)
      setTimeout(() => {
        if (refInput.current) {
          const value = refInput.current.value
          refInput.current.setSelectionRange(0, value.split('.md')[0].length)
        }
      }, 100)
    }, [selectedKeys, data, dirPath])

    const handleOpenFinder = async () => {
      setMenuStyle({ display: 'none' })
      const path = selectedKeys[0]
      await show_in_folder(path)
    }

    const handleRefresh = async () => {
      setMenuStyle({ display: 'none' })
      setCount(count + 1)
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
        setCount((count) => count + 1)
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
      setDirPath(selected)
      setExpandedKeys([])
    }
    if (!showFileTree) {
      return <div />
    }

    return (
      <div className="w-full overflow-auto h-screen">
        <div
          data-tauri-drag-region
          className={clsx(
            'px-4 pb-3 bg-white dark:bg-gray-900 sticky top-0 left-0 z-10 border-b border-gray-200 dark:border-gray-800',
            isMac ? 'pt-7' : 'pt-4'
          )}
        >
          <div className="flex items-center w-full text-left px-2 h-8 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700">
            <SearchIcon className="w-4 h-4 flex-none text-slate-300 dark:text-slate-400" />
            <input
              className="flex-auto bg-transparent w-full px-2 focus:ring-0 outline-none h-full border-0 text-slate-900 dark:text-slate-200"
              aria-label="search"
              onKeyDown={onChange}
            />
          </div>
        </div>
        <SearchList
          value={searchList}
          onSelect={onSelect}
          searchValue={searchValue}
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
                className="py-[2px] px-2  cursor-pointer text-black hover:text-white hover:bg-blue-500 rounded flex justify-between"
              >
                <span>{item.name}</span>
                <span className="opacity-50">{item.extra}</span>
              </div>
            ))}
          </div>
          <div className="mr-3 ml-1 overflow-x-hidden pb-12 pt-3">
            <div className="text-sm font-semibold flex ml-3 mb-2">
              <HomeIcon className="w-4 h-4 mr-1 flex-none" />
              <span className="flex-auto">{getCurrentFolderName(dirPath)}</span>
            </div>
            <Tree
              onRightClick={onRightClick}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
              onSelect={(key) => {
                if (isMdFile(key)) {
                  onSelect(key)
                }
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
        </SearchList>
      </div>
    )
  }
)

export default memo(FileTree)
