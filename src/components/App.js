import React, { useState, useEffect } from 'react'
import Pen from './Pen'

import {
  exists,
  createDir,
  writeTextFile,
  readTextFile,
  BaseDirectory,
} from '@tauri-apps/api/fs'
import initial from '@/utils/initial/'
import { documentDir, resolve } from '@tauri-apps/api/path'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { supportTextFile, isMdFile } from './utils/file-tree-util'
import { listen } from '@tauri-apps/api/event'
import { useEffectOnce } from 'react-use'

export default function Main(props) {
  const [loading, setLoading] = useState(true)
  const [dirPath, setDirPath] = useLocalStorage('dir-path', '')
  const [filePath, setFilePath] = useLocalStorage('filePath', '')
  const [defaultValue, setDefaultValue] = useState('')

  useEffectOnce(() => {
    async function load() {
      if (supportTextFile(filePath)) {
        const res = await readTextFile(filePath)
        setDefaultValue(res)
      }
    }
    load()
  })

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
        }
        setDirPath(path)
      }
      setLoading(false)
    }
    load()
  }, [dirPath, setDirPath])

  useEffect(() => {
    listen('tauri://file-drop', async (event) => {
      if (isMdFile(event.payload[0])) {
        const res = await readTextFile(filePath)
        setDefaultValue(res)

        setFilePath(event.payload[0])
      } else {
        setDirPath(event.payload[0])
      }
    })
  }, [])

  const handleSetFilePath = async (path) => {
    try {
      const res = await readTextFile(path)
      setDefaultValue(res)
    } catch (error) {}
    setFilePath(path)
  }

  if (loading) {
    return <div className="loading">loading...</div>
  }

  return (
    <Pen
      dirPath={dirPath}
      setDirPath={setDirPath}
      setFilePath={handleSetFilePath}
      filePath={filePath}
      defaultValue={defaultValue}
      {...props}
    />
  )
}
