import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Tree, ConfigProvider } from 'antd'
import { FileMarkdownOutlined } from '@ant-design/icons'
import {
  getParentKey,
  isMdFile,
  mapTree,
  findPathTree,
  sortFile,
  listenKeyDown,
} from './utils/file-tree-util'

import useLocalStorage from 'react-use/lib/useLocalStorage'
import { confirm, message, open } from '@tauri-apps/api/dialog'
import { documentDir } from '@tauri-apps/api/path'
import { appWindow } from '@tauri-apps/api/window'
import {
  createDir,
  readDir,
  removeFile,
  renameFile,
  writeTextFile,
  removeDir,
} from '@tauri-apps/api/fs'
import { t } from '@/utils/i18n'
import { tauri } from '@tauri-apps/api'

async function show_in_folder(path) {
  await tauri.invoke('show_in_folder', { path })
}

const { DirectoryTree } = Tree

export const FileTree = forwardRef(
  ({ onSelect, selectedPath, showFileTree, setShowPPT }, ref) => {
    const [count, setCount] = useState(0)
    const [expandedKeys, setExpandedKeys] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [autoExpandParent, setAutoExpandParent] = useState(true)

    const refInput = useRef([])
    const [dataList, setDataList] = useState([])
    const [data, setData] = useState([])
    const [dirPath, setDirPath] = useLocalStorage('dir-path', '')

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
      readDir(dirPath, { recursive: true }).then((entries) => {
        if (entries) {
          let list = []
          const generateList = (data) => {
            for (let i = 0; i < data.length; i++) {
              const node = data[i]
              list.push({ name: node.name, path: node.path })
              if (node.children) {
                generateList(node.children)
              }
            }
          }

          const payloadArr = dirPath.split('/')
          const lastData = [
            {
              name: payloadArr[payloadArr.length - 1],
              path: dirPath,
              children: entries,
            },
          ]
          generateList(lastData)

          setDataList(list)
          setData(lastData)
          if (expandedKeys.length === 0) {
            setExpandedKeys([dirPath])
          }
        }
      })
    }, [dirPath, count])

    useImperativeHandle(
      ref,
      () => ({
        setDirPath,
        reload: () => setCount((p) => p + 1),
      }),
      []
    )

    const onExpand = (newExpandedKeys) => {
      setExpandedKeys(newExpandedKeys)
      setAutoExpandParent(false)
    }

    const onChange = (e) => {
      if (e.keyCode !== 13) {
        return
      }
      const { value } = e.target
      const newExpandedKeys = dataList
        .map((item) => {
          const name = item.name
          if (
            name
              .trim()
              .replace(/\.mdx?$/, '')
              .toLowerCase()
              .indexOf(value.toLowerCase()) > -1
          ) {
            return getParentKey(item.path, data)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      setExpandedKeys(newExpandedKeys)
      setSearchValue(value)
      setAutoExpandParent(true)
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
      const payloadArr = path.split('/')
      payloadArr[payloadArr.length - 1] = name
      const newPath = payloadArr.join('/')
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

            const index = strTitle
              .trim()
              .replace(/\.mdx?$/, '')
              .toLowerCase()
              .indexOf(searchValue.toLowerCase())
            const beforeStr = strTitle.substring(0, index)
            const afterStr = strTitle.slice(index + searchValue.length)
            let title =
              index > -1 ? (
                <span className="select-none">
                  {beforeStr}
                  <span className="text-pink-400">{searchValue}</span>
                  {afterStr}
                </span>
              ) : (
                <span className="select-none">{strTitle}</span>
              )
            if (item.input) {
              title = (
                <input
                  ref={refInput}
                  onBlur={onBlur}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
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
            if (index === -1) {
              return false
            }
            if (isMdFile(item.path)) {
              return {
                icon: <FileMarkdownOutlined />,
                className: selectedPath === item.path ? 'menu-active' : '',
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

    const onRightClick = (info) => {
      setMenuStyle({
        display: 'block',
        top: info.event.clientY,
        left: info.event.clientX,
      })
      setSelectedKeys([info.node.key])
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
      const payloadArr = path.split('/')
      const name = payloadArr[payloadArr.length - 1]
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

    /**
     * 键盘事件
     */
    useEffect(() => {
      const removeListen = listenKeyDown({
        handleDelete,
        handleRename,
        showFileTree,
      })
      return removeListen
    }, [handleDelete, handleRename, showFileTree])

    let menu = [
      { name: t('Rename'), event: handleRename, extra: 'Enter' },
      { name: t('Delete'), event: handleDelete, extra: '⌘Backspace' },
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
    }
    if (!showFileTree) {
      return <div />
    }
    if (!dirPath) {
      return (
        <div
          data-tauri-drag-region
          className="w-full flex flex-col justify-center items-center text-sm h-screen"
        >
          <button
            className="rounded-md text-sm font-semibold leading-6 py-1.5 px-5  hover:bg-sky-400 bg-sky-500 text-white shadow-sm dark:shadow-highlight/20"
            onClick={handleChooseDir}
          >
            {t('Open Folder')}
          </button>
          <p className="mt-4 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            {t('Has no open folder')}
          </p>
        </div>
      )
    }

    return (
      <div className="w-full overflow-auto h-screen">
        <div
          data-tauri-drag-region
          className="px-4 pb-3 pt-7 bg-white dark:bg-gray-900 sticky top-0 left-0 z-10 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center w-full text-left space-x-3 px-4 h-8 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 flex-none text-slate-300 dark:text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input
              className="flex-auto bg-transparent w-full outline-none"
              aria-label="search"
              onKeyDown={onChange}
            />
          </div>
        </div>
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
        <div className="mx-3 overflow-x-hidden pb-10 pt-3">
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  colorBgContainer: 'transparent',
                  colorText: 'inherit',
                  controlItemBgHover: 'rgba(0,0,0,.2)',
                  controlHeightSM: 30,
                },
              },
            }}
          >
            <DirectoryTree
              className="file-tree"
              onRightClick={onRightClick}
              selectedKeys={selectedKeys}
              onSelect={(keys) => {
                setSelectedKeys(keys)
                if (isMdFile(keys[0])) {
                  onSelect(keys[0])
                }
              }}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={treeData}
            ></DirectoryTree>
          </ConfigProvider>
        </div>
      </div>
    )
  }
)
