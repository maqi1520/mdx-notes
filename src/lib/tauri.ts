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
    const path = await resolve(documentDirPath, 'mdx-editor')

    if (!(await exists(path))) {
      await mkdir('mdx-editor', {
        baseDir: BaseDirectory.Document,
      })
      await mkdir('mdx-editor/plugins', {
        baseDir: BaseDirectory.Document,
      })
      await mkdir('mdx-editor/plugins/themes', {
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

export const uploadImage = async (blob) => {
  const contents = await blob.arrayBuffer()
  const time = new Date().valueOf()
  let fileName = `\\img\\${time}.png`

  const dirPath = getItem('dir-path') || ''
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
