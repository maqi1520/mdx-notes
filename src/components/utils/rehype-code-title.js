import { visit } from 'unist-util-visit'

export function rehypeCodeTitle(options) {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || node.tagName !== 'pre' || node.properties['data-title']) {
        return
      }

      let codeTitle = ''

      const codeNode = node?.children[0]
      let meta = codeNode?.data?.meta || codeNode?.properties?.metastring || ''
      const match = meta.match(/title=([^ ]+)/)
      // 如果匹配成功
      if (match && match[1]) {
        codeTitle = match[1]
      }
      const codeHeaderNodes = [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'code__tools',
          },
          children: options.isMac
            ? [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    class: 'red code__circle',
                  },
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    class: 'yellow code__circle',
                  },
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    class: 'green code__circle',
                  },
                },
              ]
            : [],
        },
      ]
      if (codeTitle) {
        codeHeaderNodes.push({
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'code-title',
          },
          children: [
            {
              type: 'text',
              value: codeTitle,
            },
          ],
        })
      }
      codeHeaderNodes.push({
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'code__tools_right',
        },
        children: [
          {
            type: 'text',
            value: ' ',
          },
        ],
      })
      if (!codeTitle && !options.isMac) {
        return
      }

      node.children = [
        {
          type: 'element',
          tagName: 'section',
          properties: {
            class: 'code__header',
          },
          children: codeHeaderNodes,
        },
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            style: 'margin:0',
            'data-title': true,
          },
          children: node.children,
        },
      ]
    })
  }
}
