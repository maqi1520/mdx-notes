import React, { useState, useEffect } from 'react'
import Pen from './Pen'

import {
  exists,
  createDir,
  readDir,
  writeTextFile,
  readTextFile,
  BaseDirectory,
} from '@tauri-apps/api/fs'
import initial from '@/utils/initial/'
import { documentDir, resolve } from '@tauri-apps/api/path'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { store } from '../monaco/data'
import { isMdFile } from './utils/file-tree-util'
import { listen } from '@tauri-apps/api/event'

export default function Main(props) {
  const [loading, setLoading] = useState(true)
  const [dirPath, setDirPath] = useLocalStorage('dir-path', '')
  const [filePath, setFilePath] = useLocalStorage('filePath')

  const [fileTreeData, setTreeData] = useState([])

  useEffect(() => {
    async function load() {
      const res = await exists(dirPath)
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
      } else {
        try {
          const themePath = await resolve(dirPath, 'plugins/themes')
          const themeEntries = await readDir(themePath)
          store.pluginThemes = {}
          for (let index = 0; index < themeEntries.length; index++) {
            const theme = themeEntries[index]
            const name = theme.name.split('.css')[0]
            const content = await readTextFile(theme.path)
            store.pluginThemes[name] = {
              name,
              css: content,
            }
          }
          console.log(store.pluginThemes)
        } catch (error) {
          console.log(error)
        }

        const entries = await readDir(dirPath, { recursive: true })
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

          setTreeData(entries)
        }
      }

      setLoading(false)
    }
    load()
  }, [dirPath, setDirPath])

  useEffect(() => {
    listen('tauri://file-drop', async (event) => {
      if (isMdFile(event.payload[0])) {
        setFilePath(event.payload[0])
      } else {
        setDirPath(event.payload[0])
      }
    })
  }, [])

  if (loading) {
    return <div className="loading">loading...</div>
  }

  console.log(store.pluginThemes)

  return (
    <Pen
      dirPath={dirPath}
      setDirPath={setDirPath}
      setFilePath={setFilePath}
      filePath={filePath}
      fileTreeData={fileTreeData}
      {...props}
    />
  )
}
