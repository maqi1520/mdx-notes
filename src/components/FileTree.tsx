import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo,
  useMemo,
} from 'react'
import {
  isMdFile,
  supportFile,
  sortFile,
  renamePath,
  getCurrentFolderName,
  isMacOS,
} from './utils/file-tree-util'

import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from 'react-i18next'
import {
  fullScreen,
  searchKeywordInDir,
  showInFlower,
  chooseDir,
  exists,
  mkdir,
  rename,
  writeTextFile,
  remove,
} from '@/lib/bindings'
import Tree from './Tree'
import SearchList from './SearchList'
import TocList from './TocList'
import clsx from 'clsx'
import {
  FolderRoot,
  SearchIcon,
  FolderPlusIcon,
  ListTreeIcon,
  TableOfContentsIcon,
  XCircleIcon,
} from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useConfirm } from './ui/confirm'
import {
  FileNode,
  MenuItemProps,
  SearchResultItem,
  TocItem,
} from '@/utils/types'
import { useStorage } from '@/utils/storage'

interface Props {
  onSelect: (path: string) => void
  selectedPath: string
  setShowPPT: () => void
  reloadTree: () => void
  onScroll: (scrollLine: number) => void
  dirPath: string
  setDirPath: (path: string) => void
  fileTreeData: FileNode[]
  toc: TocItem[]
  scrollLine: number
}

const FileTree = ({
  onSelect,
  selectedPath,
  setShowPPT,
  reloadTree,
  fileTreeData,
  onScroll,
  dirPath,
  setDirPath,
  toc,
  scrollLine,
}: Props) => {
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const { t } = useTranslation()
  const [showToc, setShowToc] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const searchInputRef = useRef<HTMLInputElement>(null)
  const refInput = useRef<HTMLInputElement>(null)
  const [searchList, setSearchList] = useState<SearchResultItem[]>([])
  const [expandedKeys, setExpandedKeys] = useStorage<string[]>(
    'expandedKeys',
    []
  )

  // 选中当前文件
  useEffect(() => {
    setSelectedKeys([selectedPath])
  }, [selectedPath])

  const [action, setAction] = useState({
    path: '',
    type: '',
  })
  // 新建快捷键
  useHotkeys('meta+n', async () => {
    if (dirPath) {
      const fileName = 'Untitled_' + new Date().valueOf() + '.md'
      await writeTextFile(dirPath + '/' + fileName, '')
      setSelectedKeys([dirPath + '/' + fileName])
      reloadTree()
      onSelect(dirPath + '/' + fileName)
    } else {
      toast({
        title: t('Prompt'),
        description: t('Please set the working directory'),
      })
    }
  })

  const fileExists = async () => {
    toast({
      title: t('Prompt'),
      description: t('File already exists'),
    })
    setAction({
      path: '',
      type: '',
    })
  }

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
    const result = await searchKeywordInDir<SearchResultItem[]>(
      value.trim(),
      dirPath
    )
    console.log('search', result)
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
        await rename(path, newPath)
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
        await mkdir(newPath, { recursive: true })
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
        data-dir={item.is_directory}
        onClick={(e) => e.stopPropagation()}
        className="h-[30px] mt-0 border-2 border-sky-500 w-[160px] bg-white text-black px-1 outline-none"
        defaultValue={title}
      />
    )
    const loop = (data: FileNode[], parent: FileNode) => {
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
              ...item,
              title,
              key: item.path,
              children: loop(item.children, item),
            }
          }
          if (item.path && supportFile(item.path)) {
            return {
              ...item,
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
            is_file: action.type === 'createFile',
            is_directory: action.type === 'createDir',
            path: parent.path,
            title: renterInput({ path: parent.path }, ''),
            key: parent.path,
          },
          ...result,
        ]
      }
      return result
    }

    return loop(fileTreeData, {
      name: 'root',
      path: dirPath,
      is_file: false,
      is_directory: true,
    })
  }, [searchValue, selectedPath, fileTreeData, action])

  const menuRef = useRef<HTMLDivElement>(null)
  const [selectedKeys, setSelectedKeys] = useState([selectedPath])
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
    display: 'none',
    top: 0,
    left: 0,
  })

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
    if (expandedKeys?.includes(path)) {
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
    if (expandedKeys?.includes(path)) {
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
    showInFlower(path)
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

    confirm({
      title: t('Delete confirmation'),
      description: `${t('Are you sure you want to delete')} ${name}?`,
      onOk: async () => {
        if (supportFile(path)) {
          await remove(path)
        } else {
          remove(path, {
            recursive: true,
          })
        }
        reloadTree()
      },
    })
  }, [selectedKeys, dirPath])

  const handlePPT = async () => {
    setMenuStyle({ display: 'none' })
    setShowPPT()
    fullScreen()
  }

  let menu: MenuItemProps[] = [
    { name: t('Rename'), event: handleRename },
    { name: t('Delete'), event: handleDelete },
    { name: t('PPT View'), event: handlePPT },
    { name: t('Reveal in Finder'), event: handleOpenFinder },
  ]
  const dirItemMenu = [
    {
      name: t('New File'),
      event: handleCreate,
      extra: isMacOS ? '⌘ N' : 'Ctrl N',
    },
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
    const selected = await chooseDir()
    if (selected) {
      setDirPath(selected)
      setExpandedKeys([])
    }
  }

  return (
    <div className="relative w-full overflow-auto h-screen flex flex-col">
      <div
        data-tauri-drag-region
        className={clsx(
          'pb-3 px-3 bg-white dark:bg-gray-900 sticky top-0 left-0 z-10 border-b flex-none dark:shadow-highlight/4',
          isMacOS && 'pt-6',
          !isMacOS && 'pt-[30px]'
        )}
      >
        <div className="h-9 flex items-center">
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
                  if (searchInputRef.current) {
                    searchInputRef.current.value = ''
                  }
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
              {showToc ? <ListTreeIcon /> : <TableOfContentsIcon />}
            </span>
          )}
        </div>
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
              className="text-gray-500 text-xs leading-5 font-semibold bg-gray-50 py-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-950 dark:shadow-highlight/4 w-full border-t border-gray-200 dark:border-gray-800 flex  justify-center items-center"
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

export default memo(FileTree)
