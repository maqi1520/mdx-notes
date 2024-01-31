import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const generate = async (keyword, callback, lastCallback) => {
  const messages = [
    {
      role: 'user',
      content: keyword,
    },
  ]
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
    }),
  })
  console.log('Edge function returned.')

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  // This data is a ReadableStream
  const data = response.body
  if (!data) {
    return
  }

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let done = false
  let result = ''

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    result = result + chunkValue
    callback(result)
  }
  lastCallback(result)
}

export const addAction = (editor) => {
  let contentWidget
  editor.addAction({
    id: 'mdx-ask-ai',
    label: 'ASK AI',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL],
    // A precondition for this action.
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 0,
    run: function (ed) {
      let text = ed.getModel().getValueInRange(ed.getSelection())
      console.log(text)
      const layout = editor.getLayoutInfo()
      const selection = ed.getSelection()
      console.log(layout)
      console.log(selection)
      //   editor.executeEdits('', [
      //     { range: ed.getSelection(), text: `**${text}**` },
      //   ])

      // Add a content widget (scrolls inline with text)
      contentWidget = {
        domNode: (function () {
          var domNode = document.createElement('div')
          domNode.className = 'px-1'

          var content = document.createElement('div')
          content.className =
            'suggest-widget border border-gray-200 dark:border-gray-800 shadow-inner p-4 text-lg'

          domNode.appendChild(content)
          content.innerHTML = `<div class="details"><div class="monaco-scrollable-element">
          <div class="body">
          <div class="header">
          <div class="type"></div>
          </div>
          </div></div></div>`

          const herder = content.querySelector('.header')
          const type = content.querySelector('.type')
          const body = content.querySelector('.body')

          var button = document.createElement('span')
          button.className = 'close'

          var appendButton = document.createElement('button')
          appendButton.className =
            'bg-sky-500 text-white text-sm rounded px-2 py-1 mt-3'
          appendButton.textContent = '插入'

          button.addEventListener('click', () => {
            editor.removeContentWidget(contentWidget)
          })

          herder.appendChild(button)
          domNode.style.width = layout.contentWidth - 20 + 'px'
          generate(
            text,
            (res) => {
              type.innerHTML = res
            },
            (result) => {
              body.appendChild(appendButton)
              appendButton.addEventListener('click', () => {
                const line = editor.getPosition()
                const range = new monaco.Range(
                  line.lineNumber + 1,
                  1,
                  line.lineNumber + 1,
                  1
                )
                console.log(result)
                editor.executeEdits('', [
                  { range, text: result, forceMoveMarkers: true },
                ])
                editor.removeContentWidget(contentWidget)
              })
            }
          )
          return domNode
        })(),
        getId: function () {
          return 'my.content.widget'
        },
        getDomNode: function () {
          return this.domNode
        },
        getPosition: function () {
          return {
            position: {
              lineNumber: selection.endLineNumber + 1,
              column: 1,
            },
            preference: [
              monaco.editor.ContentWidgetPositionPreference.BELOW,
              monaco.editor.ContentWidgetPositionPreference.ABOVE,
            ],
          }
        },
      }

      editor.addContentWidget(contentWidget)
    },
  })
}
