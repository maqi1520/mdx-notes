import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { debounce } from 'debounce'
import { store } from '../monaco/data'

export const HTML_URI = 'file:///index.md'

function createSuggestions(range) {
  const filePath = JSON.parse(localStorage.getItem('filePath'))
  return store.mdFiles.reduce((result, item) => {
    if (item.path !== filePath) {
      result.push({
        label: item.name,
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: item.name,
        range: range,
      })
    }
    return result
  }, [])
}

export function setupMarkdownMode(content, onChange, getEditor) {
  const disposables = []

  disposables.push(
    monaco.languages.registerCompletionItemProvider('markdown', {
      triggerCharacters: ['['],
      provideCompletionItems: function (model, position) {
        // 光标前2个位置字符
        var textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 2,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })

        var match = textUntilPosition.match(/\[\[/)
        if (!match) {
          return { suggestions: [] }
        }
        var word = model.getWordUntilPosition(position)
        var range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        return {
          suggestions: createSuggestions(range),
        }
      },
    })
  )

  const model = monaco.editor.createModel(
    content || '',
    'markdown',
    monaco.Uri.parse(HTML_URI)
  )
  disposables.push(model)

  const updateDecorations = debounce(async () => {}, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}

export const CSS_URI = 'file:///index.css'

export function setupCssMode(content, onChange, getEditor) {
  const disposables = []

  const model = monaco.editor.createModel(
    content || '',
    'css',
    monaco.Uri.parse(CSS_URI)
  )
  disposables.push(model)

  const updateDecorations = debounce(async () => {}, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}

export const JS_URI = 'file:///index.js'

export function setupJavaScriptMode(content, onChange, getEditor) {
  const disposables = []

  const model = monaco.editor.createModel(
    content || '',
    'javascript',
    monaco.Uri.parse(JS_URI)
  )
  disposables.push(model)

  const updateDecorations = debounce(async () => {}, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}
