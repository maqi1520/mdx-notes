//@ts-nocheck
import { Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

export default function remarkTocHeadings(options) {
  return (tree: Parent) =>
    visit(tree, 'heading', (node) => {
      const textContent = toString(node)
      options.exportRef.push({
        value: textContent,
        line: node.position.end.line,
        depth: node.depth,
      })
    })
}
