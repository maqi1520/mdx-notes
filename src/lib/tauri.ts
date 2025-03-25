import { listen } from '@tauri-apps/api/event'
import { type } from '@tauri-apps/plugin-os'
import { convertFileSrc } from '@tauri-apps/api/core'

import {
  exists,
  writeTextFile,
  mkdir,
  BaseDirectory,
  writeFile,
} from '@tauri-apps/plugin-fs'
import initial from '@/utils/initial'
import { documentDir, resolve } from '@tauri-apps/api/path'
import { getCurrent } from '@tauri-apps/api/window'
export {
  writeTextFile,
  readTextFile,
  exists,
  mkdir,
  rename,
  remove,
} from '@tauri-apps/plugin-fs'
export { resolve } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-shell'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import { open as openDialog } from '@tauri-apps/plugin-dialog'
import { getItem } from '@/utils/storage'

/**
 * 监听文件拖放
 * @param cb
 * @returns
 */
export const listenDrop = (cb: (path: string) => void) => {
  return listen('tauri://drop', async (event: any) => {
    console.log('tauri://drop', event)
    const path = event.payload.paths[0]
    cb(path)
  })
}

/**
 * 创建默认的工作目录目录
 * @param dirPath
 * @returns
 */
export const createDefaultDirPath = async (dirPath: string) => {
  const res = await exists(dirPath!)

  if (!res) {
    const documentDirPath = await documentDir()
    const path = await resolve(documentDirPath, 'mdx-notes')

    if (!(await exists(path))) {
      await mkdir('mdx-notes', {
        baseDir: BaseDirectory.Document,
      })
      await mkdir('mdx-notes/plugins', {
        baseDir: BaseDirectory.Document,
      })
      await mkdir('mdx-notes/plugins/themes', {
        baseDir: BaseDirectory.Document,
      })

      for (const key in initial) {
        const content = initial[key]
        await writeTextFile(`${path}/${key}`, content)
      }
    }
    return path
  }
  return dirPath
}

export const listenFocus = (cb: () => void) => {
  return getCurrent().listen('tauri://focus', async () => {
    console.log('Window has gained focus!')
    cb()
  })
}

export const openLink = open

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
  const baseUrl = getItem('dir-path') || ''
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
  const filePath = getItem('filePath') || ''
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
  const os = await type()
  return os === 'macos'
}

export const clipboardWriteText = async (text: string) => {
  return writeText(text)
}

// 修改图片保存路径为选择目录的同级目录
export const uploadImage = async (blob) => {
  const contents = await blob.arrayBuffer()
  const now = new Date()
  // 时间格式 2025-3-25_09-20-27_875 ，用于保存图片2025-3-25_09-20-27_875.png
  const time =
    [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') +
    '_' +
    [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join('-') +
    '_' +
    String(now.getMilliseconds()).padStart(3, '0')

  // 获取当前编辑的文件
  const filePath = (getItem('filePath') || '').replace(/\\/g, '/')
  const dirDepth = filePath.split('/').slice(0, -1).length

  // 获取当前的工作目录
  const dirPath = (getItem('dir-path') || '').replace(/\\/g, '/')
  const parentDirPath = dirPath.split('/').slice(0, -1).join('/')

  // 计算出工作目录与文件有多少层目录，然后得出图片位置
  const parentDepth = parentDirPath.split('/').length
  const extraDepth = dirDepth - parentDepth
  const relativePathPrefix = '../'.repeat(extraDepth)

  const imageDirPath = await resolve(parentDirPath, 'images')
  const isWindowsPath = !dirPath.includes('/')
  const fileName = `${isWindowsPath ? '\\' : '/'}images${
    isWindowsPath ? '\\' : '/'
  }${time}.png`

  if (!(await exists(imageDirPath))) {
    await mkdir(imageDirPath)
  }

  const fullPath = `${parentDirPath}${fileName}`
  await writeFile(fullPath, contents)

  return {
    path: `${relativePathPrefix}images/${time}.png`,
    fullPath,
  }
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
  return invoke<T>('read_dir', { path: dirPath })
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
  return openDialog({
    directory: true,
    defaultPath: await documentDir(),
  })
}
