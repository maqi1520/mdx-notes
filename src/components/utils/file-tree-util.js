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

export function mapTree(path, tree, fn) {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.path === path) {
      tree[i] = fn(node)
      break
    }
    if (node.children) {
      node.children = mapTree(path, node.children, fn)
    }
  }
  return [...tree]
}

export function findPathTree(path, tree) {
  let inTree = false
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.path === path) {
      inTree = true
      break
    }
    if (node.children) {
      inTree = findPathTree(path, node.children)
    }
  }
  return inTree
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
      const baseNameA = nameA.substring(0, nameA.lastIndexOf('.'))
      const baseNameB = nameB.substring(0, nameB.lastIndexOf('.'))

      if (baseNameA < baseNameB) {
        return -1
      }

      if (baseNameA > baseNameB) {
        return 1
      }
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
