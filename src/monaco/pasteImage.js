import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { writeBinaryFile } from '@tauri-apps/api/fs'

const codeToUpload = {
  none: async (blob) => {
    const contents = await blob.arrayBuffer()
    const fileName = `/img/${new Date().valueOf()}.png`
    await writeBinaryFile({
      //当前工作目录
      path: `${JSON.parse(localStorage.getItem('dir-path'))}${fileName}`,
      contents,
    })
    return fileName
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
        const config = JSON.parse(localStorage.getItem('config'))
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
