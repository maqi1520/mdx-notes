import { listen } from '@tauri-apps/api/event'
import { type } from '@tauri-apps/plugin-os'
import { convertFileSrc } from '@tauri-apps/api/core'

import { mkdir, BaseDirectory } from '@tauri-apps/plugin-fs'
import initial from '@/utils/initial'
import { documentDir, resolve } from '@tauri-apps/api/path'
import { getCurrent } from '@tauri-apps/api/window'
export { mkdir, rename, remove } from '@tauri-apps/plugin-fs'
export { resolve } from '@tauri-apps/api/path'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { save } from '@tauri-apps/plugin-dialog'

interface FileNode {
  id: string
  pid: string
  name: string
  path: string
  is_file: boolean
  is_directory: boolean
  content?: string
  children?: FileNode[] | null
}

const data: FileNode[] = [
  {
    pid: '0',
    id: '1',
    name: 'test',
    path: '',
    is_directory: true,
    is_file: false,
  },
  {
    pid: '1',
    id: '2',
    name: 'a.md',
    path: 'a.md',
    content: 'test',
    is_directory: false,
    is_file: true,
  },
  {
    pid: '1',
    id: '3',
    name: 'b.md',
    path: 'b.md',
    content: 'test b',
    is_directory: false,
    is_file: true,
  },
]

export const exists = async (path: string) => {
  return false
}

export const invoke = async (dirPath: string, name: string) => {
  return `${dirPath}/${name}`
}

function listToTree(data: FileNode[]): FileNode {
  let tree: FileNode
  const map = {}
  for (const item of data) {
    map[item.id] = { ...item, children: [] }
  }
  for (const id in map) {
    const item = map[id]
    if (item.pid === '0') {
      tree = {
        ...item,
        path: item.id,
      }
    } else {
      const parent = map[item.pid]
      parent.children.push({
        ...item,
        path: item.id + '.md',
      })
    }
  }
  return tree
}

export const writeTextFile = async (path: string, content: string) => {
  let find = false
  data.forEach((item) => {
    if (item.id + '.md' === path) {
      find = true
      item.content = content
    }
  })
  if (!find) {
    data.push({
      id: path,
      pid: path.split('/').slice(0, -1).join('/'),
      name: path.split('/').pop() ?? '',
      is_directory: false,
      is_file: true,
      path: path,
      content,
      children: [],
    })
  }
}
export const readTextFile = async (path: string) => {
  console.log('readTextFile', path)

  return data.find((item) => item.id + '.md' === path)?.content ?? ''
}

/**
 * 监听文件拖放
 * @param cb
 * @returns
 */
export const listenDrop = (cb: (path: string) => void) => {}

/**
 * 创建默认的工作目录目录
 * @param dirPath
 * @returns
 */
export const createDefaultDirPath = async (dirPath: string) => {
  return dirPath
}

export const listenFocus = async (cb: () => void) => {
  return () => {}
}

export const openLink = (link: string) => window.open

//给定文件路径，获取当前文件的父级路径
function getParentPath(filePath) {
  // 使用正则表达式匹配文件夹名
  const separator = filePath.includes('/') ? '/' : '\\' // 检测路径分隔符
  const parts = filePath.split(separator) // 将路径分割成数组
  const lastPart = parts[parts.length - 1] // 获取路径中的最后一个部分
  const parentPath = filePath.replace(lastPart, '')
  return parentPath
}

// 判断是否为 windows 路径
function isWindowsPath(path) {
  return /^[a-zA-Z]:\\/.test(path)
}

export function convertSrc(src) {
  const isRemote = /^https?:\/\/|^data:image\//.test(src)
  if (isRemote) {
    return src
  }
  const baseUrl = JSON.parse(localStorage.getItem('dir-path') ?? '')
  if (isWindowsPath(src)) {
    return convertFileSrc('') + src
  }
  // 相对路径
  if (/^\.?\//.test(src)) {
    return (
      convertFileSrc('') +
      `${baseUrl}${src.startsWith('./') ? src.slice(1) : src}`
    )
  }
  // 相对当前文件路径
  const filePath = JSON.parse(localStorage.getItem('filePath') ?? '')
  const filePathStr = getParentPath(filePath)
  return convertFileSrc('') + `${filePathStr}${src}`
}

export const convertImageFileSrc = (path: string) => {
  return convertFileSrc('') + path
}

export const exitFullScreen = () => {
  getCurrent().setFullscreen(false)
}

export const fullScreen = () => {
  getCurrent().setFullscreen(true)
}

export const getMacOS = async () => {
  //return navigator.userAgent.includes('Mac OS')

  return false
}

export const clipboardWriteText = async (text: string) => {
  return writeText(text)
}

export const uploadImage = async (blob) => {
  const contents = await blob.arrayBuffer()
  const time = new Date().valueOf()
  let fileName = `\\img\\${time}.png`

  const dirPath = JSON.parse(localStorage.getItem('dir-path') ?? '')
  const path = await resolve(dirPath, 'img')
  if (!(await exists(path))) {
    await mkdir(path)
  }
  if (dirPath.includes('/')) {
    fileName = `/img/${time}.png`
  }
  await writeFile(`${dirPath}${fileName}`, contents)
  return `./img/${time}.png`
}

export const downloadFile = async (fileName: string, content: string) => {
  const filePath = await save({
    title: 'Save',
    filters: [
      {
        name: fileName,
        extensions: ['html'],
      },
    ],
  })
  if (filePath) {
    await writeTextFile(filePath, content)
  }
}

export const readDir = async <T>(dirPath: string) => {
  return listToTree(data)
}

export const searchKeywordInDir = async <T>(
  keyword: string,
  dirPath: string
) => {
  return invoke<T>('search_keyword_in_dir', {
    keyword,
    path: dirPath,
  })
}

export const showInFlower = async (path: string) => {
  return await invoke('show_in_folder', { path })
}

export const chooseDir = async () => {
  return ''
}
