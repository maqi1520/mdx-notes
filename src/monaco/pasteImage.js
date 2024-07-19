import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { writeFile, mkdir, exists } from '@tauri-apps/plugin-fs'
import { resolve } from '@tauri-apps/api/path'

const codeToUpload = {
  none: async (blob) => {
    const contents = await blob.arrayBuffer()
    const time = new Date().valueOf()
    let fileName = `\\img\\${time}.png`

    const dirPath = JSON.parse(localStorage.getItem('dir-path'))
    const path = await resolve(dirPath, 'img')
    if (!(await exists(path))) {
      await mkdir(path)
    }
    if (dirPath.includes('/')) {
      fileName = `/img/${time}.png`
    }
    await writeFile(`${dirPath}${fileName}`, contents)
    return `./img/${time}.png`
  },
  PicGo: async () => {
    try {
      const res = await fetch('http://127.0.0.1:36677/upload', {
        method: 'post',
      }).then((res) => res.json())
      return res.result[0]
    } catch (error) {
      return '上传失败'
    }
  },
  uPic: async () => {
    return '上传失败'
  },
  custom: async () => {
    return '上传失败'
  },
}

export function listenPaste(editor) {
  async function handlePaste(e) {
    let selection = editor.getSelection()
    if (!selection) {
      return
    }
    let items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      let matches = items[i].type.match(/^image\/(png|jpg|jpeg|gif)$/i)

      if (matches) {
        const blob = items[i].getAsFile()
        const config = JSON.parse(localStorage.getItem('config')) ?? {
          journalDir: '',
          journalTemplateDir: '',
          upload: 'none',
          command: '',
        }
        const fileName = await codeToUpload[config.upload](blob)

        editor.executeEdits('', [
          {
            range: new monaco.Range(
              selection.endLineNumber,
              selection.endColumn,
              selection.endLineNumber,
              selection.endColumn
            ),
            text: `![image](${fileName})`,
          },
        ])
        let { endLineNumber, endColumn } = editor.getSelection()
        editor.setPosition({ lineNumber: endLineNumber, column: endColumn })
      }
    }
  }
  window.addEventListener('paste', handlePaste)

  return {
    dispose: () => window.removeEventListener('paste', handlePaste),
  }
}
