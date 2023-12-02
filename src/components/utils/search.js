import { readTextFile } from '@tauri-apps/api/fs'

export function isMdFile(path) {
  return /\.mdx?$/.test(path)
}

async function getSearchItem(node) {
  const content = await readTextFile(node.path)

  return {
    name: node.name,
    path: node.path,
    content: content.split('\n'),
  }
}

export async function searchResponse({ keywords, mdFiles }) {
  const promises = mdFiles.map((item) => getSearchItem(item))

  const list = await Promise.all(promises)

  const result = list.filter((item) => {
    item.content = item.content.filter((text) =>
      text.match(new RegExp(keywords))
    )
    if (item.name.match(new RegExp(keywords)) || item.content.length > 0) {
      return true
    }
    return false
  })
  return result
}
