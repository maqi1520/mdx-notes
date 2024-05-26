import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { CommandsRegistry } from 'monaco-editor/esm/vs/platform/commands/common/commands'
import colors from 'tailwindcss/colors'
import dlv from 'dlv'
import PrettierWorker from 'worker-loader!../workers/prettier.worker.js'
import { createWorkerQueue } from '../utils/workers'

import { t } from '@/utils/i18n'

function toHex(d) {
  return Number(d).toString(16).padStart(2, '0')
}

function getColor(path) {
  let [key, opacity = 1] = path.split('/')
  return (
    dlv(colors, key).replace('#', '') +
    toHex(Math.round(parseFloat(opacity) * 255))
  )
}

function makeTheme(themeColors) {
  return Object.entries(themeColors).map(([token, colorPath]) => ({
    token,
    foreground: getColor(colorPath),
  }))
}

export function pathToLanguage(path: string) {
  const pathArr = path.split('.')
  const ext = pathArr[pathArr.length - 1]
  const extMap = {
    js: 'javascript',
    html: 'html',
    css: 'css',
    md: 'markdown',
  }

  return extMap[ext] || 'markdown'
}

/**
 * getOrCreateModel is a helper function that will return a model if it exists
 * or create a new model if it does not exist.
 * This is useful for when you want to create a model for a file that may or may not exist yet.
 * @param value The value of the model
 * @param language The language of the model
 * @param path The path of the model
 * @returns The model that was found or created
 */
export function getOrCreateModel(
  value: string,
  language: string,
  path: string
) {
  return getModel(path) || createModel(value, language, path)
}

/**
 * getModel is a helper function that will return a model if it exists
 * or return undefined if it does not exist.
 * @param path The path of the model
 * @returns The model that was found or undefined
 */
function getModel(path: string) {
  return monaco.editor.getModel(createModelUri(path))
}

/**
 * createModel is a helper function that will create a new model
 * @param value The value of the model
 * @param language The language of the model
 * @param path The path of the model
 * @returns The model that was created
 */
function createModel(value: string, language?: string, path?: string) {
  return monaco.editor.createModel(
    value,
    language,
    path ? createModelUri(path) : undefined
  )
}

/**
 * createModelUri is a helper function that will create a new model uri
 * @param path The path of the model
 * @returns The model uri that was created
 */
function createModelUri(path: string) {
  return monaco.Uri.parse(path)
}

export function noop() {
  /** no-op */
}

export function defineTheme() {
  monaco.editor.defineTheme('tw-light', {
    base: 'vs',
    inherit: true,
    rules: [
      {
        foreground: getColor('gray.800'),
        token: '',
      },
      ...makeTheme({
        comment: 'gray.400',
        string: 'indigo.600',
        number: 'gray.800',
        tag: 'sky.600',
        delimiter: 'gray.400',
        // HTML
        'attribute.name.html': 'sky.500',
        'attribute.value.html': 'indigo.600',
        'delimiter.html': 'gray.400',
        // JS
        'keyword.js': 'sky.600',
        'identifier.js': 'gray.800',
        // CSS
        'attribute.name.css': 'indigo.600',
        'attribute.value.unit.css': 'teal.600',
        'attribute.value.number.css': 'gray.800',
        'attribute.value.css': 'gray.800',
        'attribute.value.hex.css': 'gray.800',
        'keyword.css': 'sky.600',
        'function.css': 'teal.600',
        'pseudo.css': 'sky.600',
        'variable.css': 'gray.800',
      }),
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.selectionBackground': '#' + getColor('slate.200'),
      'editor.inactiveSelectionBackground': '#' + getColor('slate.200/0.4'),
      'editorLineNumber.foreground': '#' + getColor('gray.400'),
      'editor.lineHighlightBorder': '#' + getColor('slate.100'),
      'editorBracketMatch.background': '#00000000',
      'editorBracketMatch.border': '#' + getColor('slate.300'),
      'editorSuggestWidget.background': '#' + getColor('slate.50'),
      'editorSuggestWidget.selectedBackground': '#' + getColor('slate.400/0.1'),
      'editorSuggestWidget.selectedForeground': '#' + getColor('slate.700'),
      'editorSuggestWidget.foreground': '#' + getColor('slate.700'),
      'editorSuggestWidget.highlightForeground': '#' + getColor('indigo.500'),
      'editorSuggestWidget.focusHighlightForeground':
        '#' + getColor('indigo.500'),
      'editorHoverWidget.background': '#' + getColor('slate.50'),
      'editorError.foreground': '#' + getColor('red.500'),
      'editorWarning.foreground': '#' + getColor('yellow.500'),
    },
  })

  monaco.editor.defineTheme('tw-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {
        foreground: getColor('gray.300'),
        token: '',
      },
      ...makeTheme({
        comment: 'slate.400',
        string: 'sky.300',
        number: 'slate.50',
        tag: 'pink.400',
        delimiter: 'slate.500',
        // HTML
        'attribute.name.html': 'slate.300',
        'attribute.value.html': 'sky.300',
        'delimiter.html': 'slate.500',
        // JS
        'keyword.js': 'slate.300',
        // CSS
        'attribute.name.css': 'sky.300',
        'attribute.value.unit.css': 'teal.400',
        'attribute.value.number.css': 'teal.500',
        'attribute.value.css': 'slate.300',
        'attribute.value.hex.css': 'slate.300',
        'keyword.css': 'slate.300',
        'function.css': 'slate.200',
        'pseudo.css': 'slate.300',
        'variable.css': 'slate.50',
      }),
    ],
    colors: {
      'editor.background': '#' + getColor('slate.800'),
      'editor.selectionBackground': '#' + getColor('slate.700'),
      'editor.inactiveSelectionBackground': '#' + getColor('slate.700/0.6'),
      'editorLineNumber.foreground': '#' + getColor('slate.600'),
      'editor.lineHighlightBorder': '#' + getColor('slate.700'),
      'editorBracketMatch.background': '#00000000',
      'editorBracketMatch.border': '#' + getColor('slate.500'),
      'editorSuggestWidget.background': '#' + getColor('slate.700'),
      'editorSuggestWidget.selectedBackground':
        '#' + getColor('slate.400/0.12'),
      'editorSuggestWidget.foreground': '#' + getColor('slate.300'),
      'editorSuggestWidget.selectedForeground': '#' + getColor('slate.300'),
      'editorSuggestWidget.highlightForeground': '#' + getColor('sky.400'),
      'editorSuggestWidget.focusHighlightForeground': '#' + getColor('sky.400'),
      'editorHoverWidget.background': '#' + getColor('slate.700'),
      'editorError.foreground': '#' + getColor('red.400'),
      'editorWarning.foreground': '#' + getColor('yellow.400'),
    },
  })
}

export function setupKeybindings(editor) {
  let formatCommandId = 'editor.action.formatDocument'
  editor._standaloneKeybindingService.addDynamicKeybinding(
    `-${formatCommandId}`,
    null,
    () => {}
  )
  const { handler, when } = CommandsRegistry.getCommand(formatCommandId)
  editor._standaloneKeybindingService.addDynamicKeybinding(
    formatCommandId,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    handler,
    when
  )
}

export function addAction(editor) {
  editor.addAction({
    id: 'mdx-link',
    label: t('Link'),
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 0,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [
        { range: ed.getSelection(), text: `[${text}](url)` },
      ])
    },
  })

  editor.addAction({
    id: 'mdx-bold',
    label: t('Bold'),
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 0,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [
        { range: ed.getSelection(), text: `**${text}**` },
      ])
    },
  })

  editor.addAction({
    id: 'mdx-strikethrough',
    label: t('Strikethrough'),
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 0,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [
        { range: ed.getSelection(), text: `~~${text}~~` },
      ])
    },
  })

  editor.addAction({
    id: 'mdx-italic',
    label: t('Italic'),
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 0,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [{ range: ed.getSelection(), text: `*${text}*` }])
    },
  })

  editor.addAction({
    id: 'mdx-code',
    label: t('Code'),
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyC,
    ],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 1,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [
        { range: ed.getSelection(), text: '```\n' + text + '\n```' },
      ])
    },
  })

  editor.addAction({
    id: 'mdx-inline-code',
    label: t('Inline code'),
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyV,
    ],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 1,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [
        { range: ed.getSelection(), text: '`' + text + '`' },
      ])
    },
  })

  editor.addAction({
    id: 'mdx-table',
    label: t('Table'),
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyT,
    ],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 1,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      editor.executeEdits('', [
        {
          range: ed.getSelection(),
          text: `|  ${text}  |     |\n| --- | --- |\n|     |     |`,
        },
      ])
    },
  })
}

interface Disposable {
  dispose: () => void
}

export function registerDocumentFormattingEditProviders() {
  const disposables: Disposable[] = []
  let prettierWorker

  const formattingEditProvider = {
    async provideDocumentFormattingEdits(model, _options, _token) {
      if (!prettierWorker) {
        prettierWorker = createWorkerQueue(PrettierWorker)
      }
      const { canceled, error, pretty } = await prettierWorker.emit({
        text: model.getValue(),
        language: model.getLanguageId(),
      })
      if (canceled || error) return []
      return [
        {
          range: model.getFullModelRange(),
          text: pretty,
        },
      ]
    },
  }

  // override the built-in HTML formatter
  const _registerDocumentFormattingEditProvider =
    monaco.languages.registerDocumentFormattingEditProvider
  monaco.languages.registerDocumentFormattingEditProvider = (id, provider) => {
    if (id !== 'html') {
      return _registerDocumentFormattingEditProvider(id, provider)
    }
    return _registerDocumentFormattingEditProvider(
      'html',
      formattingEditProvider
    )
  }
  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      'markdown',
      formattingEditProvider
    )
  )
  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      'css',
      formattingEditProvider
    )
  )
  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      'javascript',
      formattingEditProvider
    )
  )

  return {
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
      if (prettierWorker) {
        prettierWorker.terminate()
      }
    },
  }
}
