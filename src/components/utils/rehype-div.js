import { visit } from 'unist-util-visit'

export default function rehypeDivToSection() {
  return (tree) =>
    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'div') {
        node.name = 'section'
      }
    })
}
