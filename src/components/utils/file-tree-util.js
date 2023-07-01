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
