import { convertFileSrc } from '@tauri-apps/api/tauri'

export const getParentKey = (path, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.path === path)) {
        parentKey = node.path
      } else if (getParentKey(path, node.children)) {
        parentKey = getParentKey(path, node.children)
      }
    }
  }
  return parentKey
}

export function isMdFile(path) {
  return /\.mdx?$/.test(path)
}

export function isImageFile(path) {
  return /\.(png|gif|jpg|jpeg|webp|bmp)$/.test(path)
}

/** 文件名称双链找path */
export function findPathInTree(name, data) {
  const current = data.find((item) => name === item.name)
  if (current) {
    return current.path
  }
  return null
}

export function sortFile(array) {
  return array.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    const isFolderA = !nameA.includes('.')
    const isFolderB = !nameB.includes('.')

    if (isFolderA && !isFolderB) {
      return -1 // 文件夹在前，文件在后
    }

    if (!isFolderA && isFolderB) {
      return 1 // 文件在前，文件夹在后
    }

    if (isFolderA && isFolderB) {
      // 两个元素都是文件夹，按照字母顺序排序
      if (nameA < nameB) {
        return -1
      }

      if (nameA > nameB) {
        return 1
      }
    } else {
      // 两个元素都是文件，排除掉后缀部分后按字母顺序排序
      return nameA.localeCompare(
        nameB,
        navigator.languages[0] || navigator.language,
        { numeric: true, ignorePunctuation: true }
      )
    }

    return 0
  })
}

export function listenKeyDown({ handleRename, handleDelete, showFileTree }) {
  function handle(event) {
    if (!showFileTree || event.target.tagName !== 'BODY') {
      return
    }
    if (event.key === 'Enter') {
      handleRename()
      return
    }
    // 获取按下的键和操作系统类型
    const keyPressed = event.key === 'Delete' || event.key === 'Backspace'
    const isMacOS = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

    // 检查是否同时按下了 "cmd"（MacOS）或 "Ctrl"（Windows/Linux）和 "delete" 键
    const isCmdDeleteShortcut =
      (isMacOS && event.metaKey && keyPressed) ||
      (!isMacOS && event.ctrlKey && keyPressed)

    // 如果是快捷键组合，执行回调函数
    if (isCmdDeleteShortcut) {
      handleDelete()
    }
  }
  // 为了跨平台兼容性，监听 keydown 事件
  document.addEventListener('keydown', handle)

  return () => {
    document.removeEventListener('keydown', handle)
  }
}

export function renamePath(filePath, newName) {
  // 使用正则表达式匹配文件名
  const regex = /(\\|\/)([^\\\/]*)$/
  const match = filePath.match(regex)

  if (match) {
    // 获取文件名及文件路径
    //const separator = match[1] // 获取路径分隔符
    const fileName = match[2]
    const filePathWithoutFileName = filePath.replace(fileName, '')

    // 创建新路径
    const newFilePath = filePathWithoutFileName + newName

    return newFilePath
  } else {
    // 如果无法匹配文件名，返回原始路径
    return filePath
  }
}

// 给定文件路径中获取当前文件名称
export function getCurrentFolderName(filePath) {
  // 使用正则表达式匹配文件夹名
  const separator = filePath.includes('/') ? '/' : '\\' // 检测路径分隔符
  const parts = filePath.split(separator) // 将路径分割成数组
  const lastPart = parts[parts.length - 1] // 获取路径中的最后一个部分
  return lastPart
}

//给定文件路径，获取当前文件的父级路径
export function getParentPath(filePath) {
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
  const baseUrl = JSON.parse(localStorage.getItem('dir-path'))
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
  const filePath = JSON.parse(localStorage.getItem('filePath'))
  const filePathStr = getParentPath(filePath)
  return convertFileSrc('') + `${filePathStr}${src}`
}
