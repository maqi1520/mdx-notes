import { visit } from 'unist-util-visit'

export default function remarkLinkFoot(options) {
  return (tree) => {
    let index = 0
    const result = []
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties.title) {
        index++
        node.children.push({
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'footnote-ref',
          },
          children: [
            {
              type: 'text',
              value: `[${index}]`,
            },
          ],
        })
        result.push({
          type: 'element',
          tagName: 'p',
          properties: {
            class: 'footnote-item',
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'footnote-num',
              },
              children: [
                {
                  type: 'text',
                  value: `[${index}]`,
                },
              ],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'footnote-content',
              },
              children: [
                {
                  type: 'text',
                  value: `${node.properties.title}：`,
                },
                {
                  type: 'element',
                  tagName: 'em',
                  properties: {
                    class: 'footnote-url',
                  },
                  children: [
                    {
                      type: 'text',
                      value: ` ${node.properties.href}`,
                    },
                  ],
                },
              ],
            },
          ],
        })
      }
    })

    tree.children = [...tree.children, ...result]
  }
}
