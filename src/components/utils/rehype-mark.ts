import { visit } from 'unist-util-visit'

export function rehypeMark() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /==([^=]+)==/g
      let match
      const children: any = []
      let lastIndex = 0

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          // 添加普通文本部分
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          })
        }

        // 添加高亮文本部分
        children.push({
          type: 'element',
          tagName: 'mark',
          properties: {},
          children: [{ type: 'text', value: match[1] }],
        })

        lastIndex = match.index + match[0].length
      }

      // 添加剩余文本
      if (lastIndex < node.value.length) {
        children.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      // 替换节点
      if (children.length > 0 && parent) {
        parent.children.splice(index, 1, ...children)
      }
    })
  }
}

export function rehypeWavyUnderline() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /\^([^^]+)\^/g
      let match
      const children: any = []
      let lastIndex = 0

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          // 添加普通文本部分
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          })
        }

        // 添加波浪下划线部分
        children.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['wavy-underline'] },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['wavy-text'] },
              children: [{ type: 'text', value: match[1] }],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['wavy-line'] },
            },
          ],
        })

        lastIndex = match.index + match[0].length
      }

      // 添加剩余文本
      if (lastIndex < node.value.length) {
        children.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      // 替换节点
      if (children.length > 0 && parent) {
        parent.children.splice(index, 1, ...children)
      }
    })
  }
}
