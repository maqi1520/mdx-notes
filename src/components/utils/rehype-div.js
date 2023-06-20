import { visit } from 'unist-util-visit'

export function rehypeAddLineNumbers() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.position && node.position.end) {
        node.properties['data-line'] = node.position.end.line
      }
    })
  }
}

export default function rehypeDivToSection() {
  return (tree) =>
    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'div') {
        node.name = 'section'
      }
    })
}
