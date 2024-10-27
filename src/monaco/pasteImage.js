import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { uploadImage, remove } from '@/lib/bindings'
import { getItem } from '@/utils/storage'
import { Command } from '@tauri-apps/plugin-shell'

const codeToUpload = {
  none: async (blob) => {
    return uploadImage(blob).path
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
  uPic: async (blob) => {
    // 上传图片
    const res = await uploadImage(blob)
    try {
      let result = await Command.create('exec-sh', [
        '-c',
        `/Applications/uPic.app/Contents/MacOS/uPic -o url -u ${escape(
          res.fullPath
        )}`,
      ]).execute()

      // 上传成功后删除图片
      await remove(res.fullPath)
      return result?.stdout.split('Output URL:')[1]?.trim()
    } catch (error) {
      return '上传失败'
    }
  },
  custom: async (blob, command) => {
    // 上传图片
    const res = await uploadImage(blob)
    try {
      let result = await Command.create('exec-sh', [
        '-c',
        `${command} ${escape(res.fullPath)}`,
      ]).execute()
      // 上传成功后删除图片
      await remove(res.fullPath)

      return result?.stdout?.trim() || '执行失败'
    } catch (error) {
      console.log('error', error)
      return '上传失败'
    }
  },
}

export function listenPaste(editor) {
  async function handlePaste(e) {
    let selection = editor.getSelection()
    if (selection) {
      let items = e.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        let matches = items[i].type.match(/^image\/(png|jpg|jpeg|gif)$/i)

        if (matches) {
          const blob = items[i].getAsFile()
          const config = getItem('config') || {
            journalDir: '',
            journalTemplateDir: '',
            upload: 'none',
            command: '',
          }
          const fileName = await codeToUpload[config.upload](
            blob,
            config.command
          )

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
  }
  window.addEventListener('paste', handlePaste)

  return {
    dispose: () => window.removeEventListener('paste', handlePaste),
  }
}
