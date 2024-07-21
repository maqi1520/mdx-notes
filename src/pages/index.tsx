import React, { useState, useEffect } from 'react'

import {
  exists,
  writeTextFile,
  mkdir,
  BaseDirectory,
} from '@tauri-apps/plugin-fs'
import initial from '@/utils/initial'
import { documentDir, resolve } from '@tauri-apps/api/path'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import { isMdFile } from '@/components/utils/file-tree-util'
import { listen } from '@tauri-apps/api/event'
import Pen from '../components/Pen'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [dirPath = '', setDirPath] = useLocalStorage<string>('dir-path', '')
  const [filePath = '', setFilePath] = useLocalStorage<string>('filePath', '')

  useEffect(() => {
    async function load() {
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
        setDirPath(path)
      }
      setLoading(false)
    }
    load()
  }, [dirPath, setDirPath])

  useEffect(() => {
    listen('tauri://drop', async (event: any) => {
      console.log('tauri://drop', event)
      const path = event.payload.paths[0]

      if (isMdFile(path)) {
        setFilePath(path)
      } else {
        setDirPath(path)
      }
    })
  }, [])

  if (loading) {
    return null
  }

  return (
    <Pen
      dirPath={dirPath}
      setDirPath={setDirPath}
      setFilePath={setFilePath}
      filePath={filePath}
    />
  )
}
